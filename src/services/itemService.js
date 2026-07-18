// src/services/itemService.js
import { supabase } from "../lib/supabaseClient";
import { assignCategoryToItem } from "./categoryService";

/**
 * IT-001: 식자재 사진 업로드
 * userId별 폴더로 나눠서 저장합니다 (storage_setup.sql의 정책이
 * user_id 폴더 기준으로 권한을 검사하기 때문에 이 구조를 지켜야 함).
 * 반환되는 publicUrl을 items.img에 저장하면 됩니다.
 */
export async function uploadItemImage(userId, file) {
  const fileExt = file.name.split(".").pop();
  const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("item-images")
    .upload(filePath, file);

  if (uploadError) {
    console.error("이미지 업로드 실패:", uploadError.message);
    return { data: null, error: uploadError };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("item-images").getPublicUrl(filePath);

  return { data: { path: filePath, publicUrl }, error: null };
}

/**
 * IT-001, IT-002, IT-003: 식자재 등록
 * fields: { name, count, storage, img, purchase_date, expiration_date }
 * minorCategoryName: 사용자가 고른 소분류 (예: '채소') - 대분류는 자동 연결됨
 */
export async function registerItem(userId, fields, minorCategoryName) {
  const { data: item, error: itemError } = await supabase
    .from("items")
    .insert({
      user_id: userId,
      name: fields.name,
      count: fields.count ?? 1,
      storage: fields.storage,
      img: fields.img ?? null,
      purchase_date: fields.purchase_date ?? null,
      expiration_date: fields.expiration_date ?? null,
    })
    .select()
    .single();

  if (itemError) {
    console.error("식자재 등록 실패:", itemError.message);
    return { data: null, error: itemError };
  }

  if (minorCategoryName) {
    const { error: categoryError } = await assignCategoryToItem(
      item.id,
      minorCategoryName,
    );

    if (categoryError) {
      // 아이템 자체는 등록됐지만 카테고리 연결만 실패한 상태.
      // 치명적 에러는 아니라서 아이템 데이터는 그대로 반환하되, 에러를 함께 알려줍니다.
      console.error("카테고리 연결 실패:", categoryError.message);
      return { data: item, error: categoryError };
    }
  }

  return { data: item, error: null };
}

/**
 * IT-004: 보관함(내 식자재 목록) 조회
 * 연결된 카테고리 이름도 함께 가져옵니다.
 */
export async function getMyItems(userId) {
  const { data, error } = await supabase
    .from("items")
    .select(
      `
      *,
      category_with_item (
        category:category_id ( id, name )
      )
    `,
    )
    .eq("user_id", userId)
    .order("expiration_date", { ascending: true, nullsFirst: false });

  if (error) {
    console.error("보관함 조회 실패:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * IT-006: 식자재 정보 수정
 * fields에 넘긴 항목만 부분 수정됩니다.
 */
export async function updateItem(itemId, fields) {
  const { data, error } = await supabase
    .from("items")
    .update(fields)
    .eq("id", itemId)
    .select()
    .single();

  if (error) {
    console.error("식자재 수정 실패:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * IT-006: 식자재 삭제
 */
export async function deleteItem(itemId) {
  const { error } = await supabase.from("items").delete().eq("id", itemId);

  if (error) {
    console.error("식자재 삭제 실패:", error.message);
    return { error };
  }

  return { error: null };
}

/**
 * IT-005: 소비기한 임박 식자재 조회
 * daysThreshold일 이내에 소비기한이 도래하는 항목을 반환합니다.
 * (실제 푸시/브라우저 알림 발송은 별도 구현이 필요하고, 이 함수는
 *  "알림 대상이 되는 데이터"를 뽑아주는 역할까지만 담당합니다.)
 */
export async function getExpiringItems(userId, daysThreshold = 3) {
  const now = new Date();
  const threshold = new Date(
    now.getTime() + daysThreshold * 24 * 60 * 60 * 1000,
  );

  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("user_id", userId)
    .not("expiration_date", "is", null)
    .lte("expiration_date", threshold.toISOString())
    .gte("expiration_date", now.toISOString())
    .order("expiration_date", { ascending: true });

  if (error) {
    console.error("소비기한 임박 항목 조회 실패:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
}
