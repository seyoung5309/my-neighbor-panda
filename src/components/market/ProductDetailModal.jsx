import { useState } from "react";
// 💡 함수명을 실제 존재하는 pickProduct로 변경합니다.
import { pickProduct } from "../../services/pickService";
import "../../styles/VillageMarket.css";

function formatKoreanDate(dateStr) {
  if (!dateStr) return "정보 없음";
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default function ProductDetailModal({
  product,
  currentUserId,
  onClose,
  onPicked,
}) {
  const [isPicking, setIsPicking] = useState(false);
  const [pickError, setPickError] = useState("");

  const item = product.item;
  const isOwnProduct = item.user_id === currentUserId;

  const handlePick = async () => {
    setIsPicking(true);
    setPickError("");
    
    // 💡 중요: 함수명을 바꾸고, 인자 순서를 (상품ID, 유저ID) 순으로 뒤집어줍니다!
    const { error } = await pickProduct(product.id, currentUserId);
    setIsPicking(false);

    if (error) {
      // 서비스에서 반환한 "이미 다른 사용자가 PICK했거나..." 에러 메시지를 활용하면 더 좋습니다.
      setPickError(error.message || "PICK에 실패했습니다. 다시 시도해주세요.");
      return;
    }
    onPicked();
  };

  return (
    <div className="market-modal-overlay" onClick={onClose}>
      <div className="market-modal" onClick={(e) => e.stopPropagation()}>
        <div className="market-modal__header">
          <h2 className="market-modal__title">{item.name}</h2>
          <button
            type="button"
            className="market-modal__close"
            onClick={onClose}
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <div className="market-modal__image-wrapper">
          {item.img ? (
            <img src={item.img} alt={item.name} className="market-modal__image" />
          ) : (
            <div className="market-modal__image-fallback" />
          )}
        </div>

        <div className="market-modal__info-grid">
          <div>
            <p className="market-modal__info-label">구매 날짜</p>
            <p className="market-modal__info-value">
              {formatKoreanDate(item.purchase_date)}
            </p>
          </div>
          <div>
            <p className="market-modal__info-label">개수</p>
            <p className="market-modal__info-value">{item.count}개</p>
          </div>
        </div>

        <div className="market-modal__info-block">
          <p className="market-modal__info-label">소비기한(유통기한)</p>
          <p className="market-modal__info-value">
            {formatKoreanDate(item.expiration_date)}
          </p>
        </div>

        <div className="market-modal__info-block">
          <p className="market-modal__info-label">보관상태</p>
          <p className="market-modal__info-value">
            {item.storage ? `${item.storage}으로 보관하셔야 합니다` : "정보 없음"}
          </p>
        </div>

        {pickError && <p className="market-modal__error">{pickError}</p>}

        {!isOwnProduct && (
          <button
            type="button"
            className="market-modal__pick-btn"
            onClick={handlePick}
            disabled={isPicking}
          >
            {isPicking ? "처리 중..." : `PICK (${product.mileage} 마일리지)`}
          </button>
        )}
      </div>
    </div>
  );
}