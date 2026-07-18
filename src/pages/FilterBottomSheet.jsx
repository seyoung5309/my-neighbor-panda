import { useState } from "react";
import "../../styles/VillageMarket.css";

const CATEGORY_OPTIONS = [
  { name: "신선식품", icon: "🥬" },
  { name: "수산식품", icon: "🐟" },
  { name: "가공식품", icon: "📦" },
  { name: "축산식품", icon: "🥩" },
  { name: "유제품", icon: "🥛" },
  { name: "기타", icon: "⋯" },
];

const SORT_OPTIONS = [
  { value: "expiration", label: "소비기한 순" },
  { value: "latest", label: "최신 등록 순" },
  { value: "priceAsc", label: "마일리지 낮은 순" },
  { value: "priceDesc", label: "마일리지 높은 순" },
];

export default function FilterBottomSheet({
  initialCategories,
  initialSortBy,
  onClose,
  onApply,
}) {
  const [selected, setSelected] = useState(initialCategories);
  const [sortBy, setSortBy] = useState(initialSortBy);

  const toggleCategory = (name) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  return (
    <div className="market-sheet-overlay" onClick={onClose}>
      <div className="market-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="market-sheet__handle" />

        <div className="market-sheet__section">
          <p className="market-sheet__label">정렬 기준</p>
          <select
            className="market-sheet__select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="market-sheet__section">
          <p className="market-sheet__label">카테고리 (다중선택)</p>
          <div className="market-sheet__chips">
            {CATEGORY_OPTIONS.map((cat) => (
              <button
                key={cat.name}
                type="button"
                className={
                  selected.includes(cat.name)
                    ? "market-chip market-chip--active"
                    : "market-chip"
                }
                onClick={() => toggleCategory(cat.name)}
              >
                <span aria-hidden>{cat.icon}</span> {cat.name}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="market-sheet__apply"
          onClick={() => onApply(selected, sortBy)}
        >
          적용하기
        </button>
      </div>
    </div>
  );
}