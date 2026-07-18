import { useState } from "react";
// PK-001: 실제 함수명이 다르면 이 import만 맞춰서 바꿔주세요.
import { createPickRequest } from "../../services/pickService";
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
    const { error } = await createPickRequest(currentUserId, product.id);
    setIsPicking(false);

    if (error) {
      setPickError("PICK에 실패했습니다. 다시 시도해주세요.");
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