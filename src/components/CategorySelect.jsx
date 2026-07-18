import { useState, useRef, useEffect, useMemo, Children } from "react";
import { ChevronDown } from "lucide-react";

/**
 * CategorySelect
 * -----------------------------------------------------------------------
 * 기존 <select>/<option> 과 동일한 방식으로 동작하는 커스텀 카테고리 선택 컴포넌트.
 *
 * 사용법 (네이티브 select와 동일):
 *
 *   const [category, setCategory] = useState("");
 *
 *   <CategorySelect
 *     value={category}
 *     onChange={(e) => setCategory(e.target.value)}
 *     placeholder="카테고리"
 *   >
 *     <CategorySelect.Option value="fresh" icon="🥬">신선식품</CategorySelect.Option>
 *     <CategorySelect.Option value="seafood" icon="🐟">수산식품</CategorySelect.Option>
 *     <CategorySelect.Option value="processed" icon="🥫">가공식품</CategorySelect.Option>
 *     <CategorySelect.Option value="livestock" icon="🥩">축산식품</CategorySelect.Option>
 *     <CategorySelect.Option value="dairy" icon="🥛">유제품</CategorySelect.Option>
 *     <CategorySelect.Option value="etc" icon="⋯">기타</CategorySelect.Option>
 *   </CategorySelect>
 *
 * - value / onChange 는 네이티브 select와 동일한 시그니처
 *   (onChange 는 { target: { name, value } } 형태의 이벤트 객체를 전달)
 * - <CategorySelect.Option value="..."> 자식으로 옵션을 선언 (= <option>)
 * - 폼(form) 제출 호환을 위해 화면에 보이지 않는 실제 <select> 를 함께 렌더링
 * - 키보드 접근성: Enter/Space/ArrowDown 으로 열기, ArrowUp/Down 으로 탐색,
 *   Enter 로 선택, Esc 로 닫기, 바깥 클릭 시 닫힘
 */

function CategorySelect({
  value,
  onChange,
  name,
  placeholder = "카테고리",
  disabled = false,
  children,
}) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const rootRef = useRef(null);
  const listRef = useRef(null);

  // <CategorySelect.Option> 자식들을 <option> 처럼 파싱
  const options = useMemo(() => {
    return Children.toArray(children)
      .filter((child) => child?.props?.value !== undefined)
      .map((child) => ({
        value: child.props.value,
        label: child.props.children,
        icon: child.props.icon,
        disabled: !!child.props.disabled,
      }));
  }, [children]);

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

  // 바깥 클릭 시 닫기
  useEffect(() => {
    function handlePointerDown(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function emitChange(nextValue) {
    onChange?.({ target: { name, value: nextValue } });
  }

  function commit(index) {
    const opt = options[index];
    if (!opt || opt.disabled) return;
    emitChange(opt.value);
    setOpen(false);
  }

  function toggleOpen() {
    if (disabled) return;
    setOpen((prev) => {
      const next = !prev;
      if (next) setHighlighted(selectedIndex >= 0 ? selectedIndex : 0);
      return next;
    });
  }

  function handleKeyDown(e) {
    if (disabled) return;
    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        setOpen(true);
        setHighlighted(selectedIndex >= 0 ? selectedIndex : 0);
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlighted((h) => Math.min(h + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlighted((h) => Math.max(h - 1, 0));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (highlighted >= 0) commit(highlighted);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  }

  return (
    <div ref={rootRef} style={{ position: "relative", width: 354 }}>
      {/* 폼 호환용 네이티브 select (화면엔 안 보이지만 실제 값/제출을 담당) */}
      <select
        name={name}
        value={value ?? ""}
        onChange={(e) => emitChange(e.target.value)}
        disabled={disabled}
        aria-hidden="true"
        tabIndex={-1}
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <option value="" />
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </select>

      {/* 트리거 (헤더) */}
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={name ? `${name}-listbox` : undefined}
        disabled={disabled}
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
        style={{
          width: "100%",
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          background: "#FFFEFA",
          border: "1px solid #BFB4AA",
          borderRadius: open ? "6px 6px 0 0" : 6,
          cursor: disabled ? "not-allowed" : "pointer",
          font: "500 15px/1.4 'Pretendard', system-ui, sans-serif",
          color: selected ? "#000" : "#8A8178",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <ChevronDown
          size={18}
          strokeWidth={2}
          color="#383131"
          style={{
            transition: "transform 0.15s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {/* 옵션 목록 */}
      {open && (
        <ul
          ref={listRef}
          id={name ? `${name}-listbox` : undefined}
          role="listbox"
          aria-activedescendant={
            highlighted >= 0 ? `${name ?? "category"}-opt-${highlighted}` : undefined
          }
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            position: "absolute",
            top: 48,
            left: 0,
            right: 0,
            background: "#FFFEFA",
            border: "1px solid #BFB4AA",
            borderTop: "none",
            borderRadius: "0 0 6px 6px",
            overflow: "hidden",
            zIndex: 20,
            boxShadow: "0 8px 20px rgba(56, 49, 49, 0.08)",
          }}
        >
          {options.map((opt, i) => {
            const isSelected = opt.value === value;
            const isHighlighted = i === highlighted;
            return (
              <li
                key={opt.value}
                id={`${name ?? "category"}-opt-${i}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={opt.disabled}
                onMouseEnter={() => setHighlighted(i)}
                onClick={() => commit(i)}
                style={{
                  height: 50,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "0 20px",
                  borderTop: i === 0 ? "none" : "1px solid #BFB4AA",
                  background: isHighlighted
                    ? "#F3EFE8"
                    : isSelected
                    ? "#F8F5EF"
                    : "#FFFEFA",
                  cursor: opt.disabled ? "not-allowed" : "pointer",
                  opacity: opt.disabled ? 0.4 : 1,
                }}
              >
                <span
                  style={{
                    width: 16,
                    height: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  {opt.icon}
                </span>
                <span
                  style={{
                    font: `${isSelected ? 600 : 400} 15px/1.4 'Pretendard', system-ui, sans-serif`,
                    color: "#000",
                  }}
                >
                  {opt.label}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// 네이티브 <option> 과 동일한 역할 — 실제로 렌더링되지 않고
// CategorySelect가 children을 파싱할 때 값/라벨/아이콘 정보만 사용됩니다.
CategorySelect.Option = function Option() {
  return null;
};

export default CategorySelect;
