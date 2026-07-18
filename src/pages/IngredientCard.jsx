export default function IngredientCard({ image, label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 10,
        width: 111,
        border: "none",
        background: "transparent",
        padding: 0,
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <div
        style={{
          width: 111,
          height: 111,
          borderRadius: 16,
          background: "#F5F1E8",
          border: "1px solid #F0EBE1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {image ? (
          <img
            src={image}
            alt={label}
            style={{ width: "70%", height: "70%", objectFit: "contain" }}
          />
        ) : (
          <span style={{ fontSize: 36 }}>🥬</span>
        )}
      </div>

      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#383131",
        }}
      >
        {label}
      </span>
    </button>
  );
}