// src/constants/categoryImages.js
//
// DB(items 테이블)에는 실제 이미지 파일이나 URL을 저장하지 않고
// `category` 값만 저장합니다. 화면에 보여줄 이미지는 이 매핑 테이블을 통해
// assets 폴더의 정적 이미지(img1.png ~ img6.png)로 변환해서 사용합니다.
//
// 순서: 신선(img1) -> 수산(img2) -> 가공(img3) -> 축산(img4) -> 유제품(img5) -> 기타(img6)

import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import img4 from "../assets/img4.png";
import img5 from "../assets/img5.png";
import img6 from "../assets/img6.png";

export const CATEGORIES = ["신선", "수산", "가공", "축산", "유제품", "기타"];

export const CATEGORY_IMAGE_MAP = {
  신선: img1,
  수산: img2,
  가공: img3,
  축산: img4,
  유제품: img5,
  기타: img6,
};

/**
 * 카테고리 문자열을 받아 해당하는 assets 이미지를 반환합니다.
 * 매핑에 없는 값이 들어오면 '기타' 이미지로 대체합니다.
 */
export function getCategoryImage(category) {
  return CATEGORY_IMAGE_MAP[category] ?? CATEGORY_IMAGE_MAP["기타"];
}
