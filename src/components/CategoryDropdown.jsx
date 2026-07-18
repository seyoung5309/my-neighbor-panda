import { useState } from "react";
import styled from "styled-components";

const categories = [
    { value: "fresh", label: "🥬신선식품" },
    { value: "seafood", label: "🐟수산식품" },
    { value: "processed", label: "📦가공식품" },
    { value: "meat", label: "🥩축산식품" },
    { value: "dairy", label: "🥛유제품" },
    { value: "other", label: "기타" },
];

const DropdownWrapper = styled.div`
    position: relative;
    width: 354px;
`;

const DropdownButton = styled.button`
    width: 100%;
    height: 48px;
    background-color: #fffefa;
    border: 1px solid #bfb4aa;
    border-radius: 6px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 500;
    color: #383131;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        border-color: #a89a90;
        background-color: #fffbf5;
    }

    &:active {
        border-color: #8f8580;
    }
`;

const ArrowIcon = styled.div`
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
    transform: ${(props) => (props.isOpen ? "rotate(180deg)" : "rotate(0deg)")};

    svg {
        width: 100%;
        height: 100%;
    }
`;

const DropdownMenu = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #fffefa;
    border: 1px solid #bfb4aa;
    border-top: none;
    border-radius: 0 0 6px 6px;
    margin-top: -1px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    z-index: 1000;
    display: ${(props) => (props.isOpen ? "block" : "none")};
    animation: slideDown 0.3s ease;

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const DropdownOption = styled.button`
    width: 100%;
    padding: 12px 16px;
    background-color: #fffefa;
    border: none;
    border-bottom: 1px solid #bfb4aa;
    text-align: left;
    font-size: 16px;
    font-weight: 400;
    color: #383131;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: #f5f1ed;
    }

    &:active {
        background-color: #ebe5df;
    }

    ${(props) =>
        props.isSelected &&
        `
    background-color: #F0EBE5;
    font-weight: 600;
    
    &:hover {
      background-color: #E8E1DB;
    }
  `}
`;

const CategoryDropdown = ({ name = "category", value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedCategory = categories.find((cat) => cat.value === value);
    const selectedLabel = selectedCategory
        ? selectedCategory.label
        : "카테고리를 선택하세요";

    const handleSelect = (categoryValue) => {
        onChange?.(categoryValue);
        setIsOpen(false);
    };

    const handleClickOutside = (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsOpen(false);
        }
    };

    return (
        <DropdownWrapper onBlur={handleClickOutside} tabIndex={-1}>
            <DropdownButton onClick={() => setIsOpen(!isOpen)} type="button">
                <span>{selectedLabel}</span>
                <ArrowIcon isOpen={isOpen}>
                    <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M5.5 7.5L10.5 12.5L15.5 7.5"
                            stroke="#383131"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </ArrowIcon>
            </DropdownButton>

            <DropdownMenu isOpen={isOpen}>
                {categories.map((category) => (
                    <DropdownOption
                        key={category.value}
                        onClick={() => handleSelect(category.value)}
                        isSelected={value === category.value}
                        type="button"
                    >
                        {category.label}
                    </DropdownOption>
                ))}
            </DropdownMenu>

            <input type="hidden" name={name} value={value || ""} />
        </DropdownWrapper>
    );
};

export default CategoryDropdown;
