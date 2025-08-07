import { atom } from "jotai";

/**
 * 관리자 모드 상태
 * 전역에서 관리자/사용자 페이지 전환에 사용
 */
export const isAdminAtom = atom(false);
