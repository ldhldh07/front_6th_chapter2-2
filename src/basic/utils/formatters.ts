/**
 * 관리자용 가격 포맷팅 (원 단위)
 */
export const formatAdminPrice = (price: number): string => {
  return `${price.toLocaleString()}원`;
};

/**
 * 사용자용 가격 포맷팅 (₩ 기호)
 */
export const formatUserPrice = (price: number): string => {
  return `₩${price.toLocaleString()}`;
};
