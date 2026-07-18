// src/constants/categoryMap.js
//
// 기획서 3-3의 카테고리 구조를 그대로 옮긴 것입니다.
// DB의 Category 테이블은 계층 구조 없이 flat하게 두기로 했으므로,
// "소분류를 고르면 대분류가 자동으로 정해지는" 로직은 여기서 처리합니다.

export const CATEGORY_STRUCTURE = {
  신선식품: ["채소", "과일", "곡물", "버섯"],
  수산식품: ["생선", "해산물"],
  가공식품: ["음료", "냉동식품", "라면", "과자", "소스", "통조림", "기름"],
  축산식품: ["소고기", "돼지고기", "닭고기", "오리고기"],
  유제품: ["우유", "치즈", "버터"],
};

/**
 * 소분류 이름으로 대분류 이름을 찾습니다.
 * 매칭되는 게 없으면 null을 반환합니다 (사용자가 목록에 없는 값을 입력한 경우 등).
 */
export function getMajorCategory(minorCategoryName) {
  for (const [major, minors] of Object.entries(CATEGORY_STRUCTURE)) {
    if (minors.includes(minorCategoryName)) {
      return major;
    }
  }
  return null;
}

/**
 * 식자재 등록 화면의 드롭다운 등에서 쓸 수 있는
 * "대분류 - 소분류" 전체 목록 (플랫하게 펼친 배열)
 */
export function getAllCategoryOptions() {
  return Object.entries(CATEGORY_STRUCTURE).flatMap(([major, minors]) =>
    minors.map((minor) => ({ major, minor })),
  );
}
