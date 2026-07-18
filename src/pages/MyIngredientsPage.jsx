import IngredientCard from "./IngredientCard";

// NOTE: these are Figma-hosted temporary asset URLs (expire ~7 days after
// generation). Swap them out for your own CDN/asset URLs before shipping.
const imgLettuce =
    "https://www.figma.com/api/mcp/asset/a36a1511-9e12-4874-bf08-5d53ffe58204";
const imgApple =
    "https://www.figma.com/api/mcp/asset/a5cdeef9-0990-4b1f-b593-621b114774df";
const imgEgg =
    "https://www.figma.com/api/mcp/asset/5308b5f2-1d4e-4d23-84e3-3eb60a8b91ca";
const imgPork =
    "https://www.figma.com/api/mcp/asset/cea38001-40db-444f-841d-490fd0e64f31";
const imgCheese =
    "https://www.figma.com/api/mcp/asset/e7b5efb0-4b9c-4332-8d36-2f972ce481f4";
const imgChevronLeft =
    "https://www.figma.com/api/mcp/asset/8ce1394e-4eca-4355-95e9-fc4b89672ab2";

const INGREDIENTS = [
    { key: "lettuce", label: "상추", image: imgLettuce },
    { key: "apple", label: "사과", image: imgApple },
    { key: "egg", label: "계란", image: imgEgg },
    { key: "pork", label: "돼지고기", image: imgPork },
    { key: "cheese", label: "치즈", image: imgCheese },
];

/**
 * MyIngredientsPage ("식자재 확인하기")
 *
 * Bottom navigation intentionally omitted — this page is meant to be
 * rendered inside a layout that already provides its own navigation.
 *
 * Props:
 * - onBack?: () => void - called when the back chevron is tapped
 * - ingredients?: Array<{ key, label, image, onClick? }> - defaults to INGREDIENTS
 */
export default function MyIngredientsPage({
    onBack,
    ingredients = INGREDIENTS,
}) {
    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                maxWidth: 402,
                margin: "0 auto",
                background: "#FFFEFA",
                fontFamily: "'Pretendard', sans-serif",
                paddingBottom: 32,
            }}
        >
            {/* Header */}
            <div style={{ position: "relative", height: 124 }}>
                <button
                    onClick={onBack}
                    aria-label="뒤로 가기"
                    style={{
                        position: "absolute",
                        left: 24,
                        top: 76,
                        width: 24,
                        height: 24,
                        padding: 0,
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                    }}
                >
                    <img
                        src={imgChevronLeft}
                        alt=""
                        style={{ width: "100%", height: "100%" }}
                    />
                </button>

                <p
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: 72,
                        transform: "translateX(-50%)",
                        margin: 0,
                        whiteSpace: "nowrap",
                        fontWeight: 500,
                        fontSize: 20,
                        lineHeight: "32px",
                        letterSpacing: "-1px",
                        color: "#383131",
                    }}
                >
                    식자재 확인하기
                </p>
            </div>

            {/* Ingredient grid */}
            <div
                style={{
                    padding: "0 24px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 20,
                    columnGap: 12,
                }}
            >
                {ingredients.map((item) => (
                    <IngredientCard
                        key={item.key}
                        image={item.image}
                        label={item.label}
                        onClick={item.onClick}
                    />
                ))}
            </div>
        </div>
    );
}
