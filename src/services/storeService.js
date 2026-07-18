// src/services/storeService.js
import { supabase } from "../lib/supabaseClient";

/**
 * ST-001, ST-002: 상품 등록 (보관함 아이템 중 일부 수량만 진열 가능)
 *
 * quantityToList가 아이템의 전체 수량과 같으면 -> 기존 아이템을 그대로 상품으로 연결
 * quantityToList가 더 적으면 -> 그만큼만 떼어내 새 아이템 행을 만들고, 그걸 상품으로 연결
 *   (원래 아이템의 count는 진열한 만큼 차감됩니다)
 */
export async function listItemForSale(userId, itemId, quantityToList, mileage) {
  const { data: originalItem, error: fetchError } = await supabase
    .from("items")
    .select("*")
    .eq("id", itemId)
    .eq("user_id", userId)
    .single();

  if (fetchError) {
    console.error("아이템 조회 실패:", fetchError.message);
    return { data: null, error: fetchError };
  }

  if (quantityToList <= 0 || quantityToList > originalItem.count) {
    return {
      data: null,
      error: new Error(
        `진열 가능한 수량이 아닙니다. (보유 수량: ${originalItem.count})`,
      ),
    };
  }

  let itemIdToList = originalItem.id;

  // 부분 수량만 진열하는 경우: 원본에서 차감하고, 진열용 아이템 행을 새로 만듦
  if (quantityToList < originalItem.count) {
    const { error: updateError } = await supabase
      .from("items")
      .update({ count: originalItem.count - quantityToList })
      .eq("id", originalItem.id);

    if (updateError) {
      console.error("원본 아이템 수량 차감 실패:", updateError.message);
      return { data: null, error: updateError };
    }

    const { data: newItem, error: createError } = await supabase
      .from("items")
      .insert({
        name: originalItem.name,
        count: quantityToList,
        storage: originalItem.storage,
        img: originalItem.img,
        purchase_date: originalItem.purchase_date,
        expiration_date: originalItem.expiration_date,
        user_id: userId,
      })
      .select()
      .single();

    if (createError) {
      console.error("진열용 아이템 생성 실패:", createError.message);
      return { data: null, error: createError };
    }

    itemIdToList = newItem.id;
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      item_id: itemIdToList,
      mileage,
    })
    .select()
    .single();

  if (productError) {
    console.error("상품 등록 실패:", productError.message);
    return { data: null, error: productError };
  }

  return { data: product, error: null };
}

/**
 * ST-004: 진열 취소 (보관함으로 되돌리기)
 * 아직 거래가 시작 안 된('대기중') 상품만 취소 가능하도록 제한합니다.
 * 상품 행을 지우면, 연결됐던 아이템은 그대로 남아있으니 자연히 보관함 목록에 다시 보이게 됩니다.
 */
export async function cancelListing(productId) {
  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (fetchError) {
    console.error("상품 조회 실패:", fetchError.message);
    return { error: fetchError };
  }

  if (product.pick !== "대기중") {
    return {
      error: new Error(
        "이미 거래가 진행 중이거나 완료된 상품은 취소할 수 없습니다.",
      ),
    };
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    console.error("진열 취소 실패:", error.message);
    return { error };
  }

  return { error: null };
}

/**
 * 내가 진열한 상품 목록 (내 상점 관리 화면에서 사용)
 */
export async function getMyListings(userId) {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      item:item_id ( *, user_id )
    `,
    )
    .eq("item.user_id", userId);

  if (error) {
    console.error("내 상품 목록 조회 실패:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * 특정 사용자의 상점에 진열된 상품 목록 (다른 사람이 마을에서 상점 방문 시 사용)
 * '대기중' 상태만 보여줍니다 (이미 거래된 건 노출 안 함).
 */
export async function getStoreProducts(storeOwnerUserId) {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      item:item_id ( * )
    `,
    )
    .eq("item.user_id", storeOwnerUserId)
    .eq("pick", "대기중");

  if (error) {
    console.error("상점 상품 목록 조회 실패:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * ST-003: 상품 상세 조회 (사진, 구매 날짜, 소비기한, 수량, 보관 상태)
 */
export async function getProductDetail(productId) {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      item:item_id ( * )
    `,
    )
    .eq("id", productId)
    .single();

  if (error) {
    console.error("상품 상세 조회 실패:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
}
