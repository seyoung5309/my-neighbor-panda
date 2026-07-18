import { supabase } from "../lib/supabaseClient";

/**
 * region_key가 같은(같은 마을) 사용자들의 user_id 목록을 조회합니다.
 */
async function getUserIdsInVillage(regionKey) {
  const { data, error } = await supabase
    .from("location")
    .select("user_id")
    .eq("region_key", regionKey);

  if (error) {
    console.error("마을 사용자 조회 실패:", error.message);
    return { userIds: [], error };
  }

  return { userIds: (data || []).map((row) => row.user_id), error: null };
}

/**
 * 마을시장 상품 목록 조회
 * - 같은 마을 사용자들이 등록한, 아직 거래되지 않은(pick = '대기중') 상품만 노출 (PK-005)
 * - categoryNames가 있으면 해당 카테고리에 속한 상품만 필터링
 * - sortBy: 'expiration'(소비기한 임박순, 기본) | 'latest' | 'priceAsc' | 'priceDesc'
 */
export async function getVillageMarketProducts(
  regionKey,
  { categoryNames = [], sortBy = "expiration" } = {},
) {
  const { userIds, error: userError } = await getUserIdsInVillage(regionKey);
  if (userError) return { data: null, error: userError };
  if (userIds.length === 0) return { data: [], error: null };

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      mileage,
      sale_date,
      pick,
      item:items (
        id,
        name,
        img,
        count,
        storage,
        purchase_date,
        expiration_date,
        user_id,
        categories:category_with_item (
          category:category ( id, name )
        )
      )
      `,
    )
    .eq("pick", "대기중");

  if (error) {
    console.error("마을시장 상품 조회 실패:", error.message);
    return { data: null, error };
  }

  // 같은 마을 유저의 아이템만 클라이언트에서 한 번 더 필터링
  // (products -> items -> location처럼 여러 단계를 거치는 임베디드 필터는
  //  PostgREST에서 완전히 신뢰하기 어려워 이중 체크합니다)
  let products = (data || []).filter(
    (p) => p.item && userIds.includes(p.item.user_id),
  );

  if (categoryNames.length > 0) {
    products = products.filter((p) => {
      const itemCategoryNames = (p.item.categories || []).map(
        (c) => c.category?.name,
      );
      return categoryNames.some((name) => itemCategoryNames.includes(name));
    });
  }

  products.sort((a, b) => {
    switch (sortBy) {
      case "priceAsc":
        return a.mileage - b.mileage;
      case "priceDesc":
        return b.mileage - a.mileage;
      case "latest":
        return new Date(b.sale_date) - new Date(a.sale_date);
      case "expiration":
      default:
        return (
          new Date(a.item.expiration_date || 0) -
          new Date(b.item.expiration_date || 0)
        );
    }
  });

  return { data: products, error: null };
}
