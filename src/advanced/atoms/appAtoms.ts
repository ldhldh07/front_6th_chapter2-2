import { atom } from "jotai";

/**
 * 관리자 모드 상태
 * 전역에서 관리자/사용자 페이지 전환에 사용
 */
export const isAdminAtom = atom(false);

/**
 * 검색어 상태
 */
export const searchTermAtom = atom("");

/**
 * 디바운스된 값을 위한 제네릭 atom 팩토리
 */
export const createDebouncedAtom = <T>(initialValue: T) =>
  atom<T>(initialValue);
