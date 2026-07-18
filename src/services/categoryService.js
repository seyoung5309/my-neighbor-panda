// src/services/categoryService.js
import { supabase } from "../lib/supabaseClient";
import { getMajorCategory } from "../constants/categoryMap";

/**
 * 카테고리 이름으로 id를 찾고, 없으면 새로 만듭니다.
 * (Category.name엔 UNIQUE 제약이 걸려있어서, 동시 요청으로 인한
 *  충돌(23505)도 대비합니다.)
 */
async function findOrCreateCategory(name) {
  const { data: existing, error: findError } = await supabase
    .from("category")
    .select("*")
    .eq("name", name)
    .maybeSingle();

  if (findError) {
    console.error("카테고리 조회 실패:", findError.message);
    return { data: null, error: findError };
  }

  if (existing) {
    return { data: existing, error: null };
  }

  const { data: created, error: createError } = await supabase
    .from("category")
    .insert({ name })
    .select()
    .single();

  if (createError) {
    if (createError.code === "23505") {
      const { data: retry } = await supabase
        .from("category")
        .select("*")
        .eq("name", name)
        .single();
      return { data: retry, error: null };
    }
    console.error("카테고리 생성 실패:", createError.message);
    return { data: null, error: createError };
  }

  return { data: created, error: null };
}

/**
 * IT-003: 아이템에 카테고리를 연결합니다.
 * 사용자가 소분류(예: '채소')만 선택하면, 대분류(예: '신선식품')는
 * categoryMap.js의 매핑을 통해 자동으로 함께 연결됩니다.
 */
export async function assignCategoryToItem(itemId, minorCategoryName) {
  const majorCategoryName = getMajorCategory(minorCategoryName);

  if (!majorCategoryName) {
    return {
      data: null,
      error: new Error(
        `알 수 없는 소분류 카테고리입니다: ${minorCategoryName}`,
      ),
    };
  }

  const { data: minorCategory, error: minorError } =
    await findOrCreateCategory(minorCategoryName);
  if (minorError) return { data: null, error: minorError };

  const { data: majorCategory, error: majorError } =
    await findOrCreateCategory(majorCategoryName);
  if (majorError) return { data: null, error: majorError };

  const { data, error } = await supabase
    .from("category_with_item")
    .insert([
      { item_id: itemId, category_id: minorCategory.id },
      { item_id: itemId, category_id: majorCategory.id },
    ])
    .select();

  if (error) {
    console.error("카테고리 연결 실패:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * 특정 아이템에 연결된 카테고리 목록 조회 (대분류 + 소분류 함께 반환됨)
 */
export async function getCategoriesByItem(itemId) {
  const { data, error } = await supabase
    .from("category_with_item")
    .select("category:category_id(id, name)")
    .eq("item_id", itemId);

  if (error) {
    console.error("아이템 카테고리 조회 실패:", error.message);
    return { data: null, error };
  }

  return { data: data.map((row) => row.category), error: null };
}
