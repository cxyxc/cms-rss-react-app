import { atom } from "recoil";

const defaultGlobalList = JSON.parse(localStorage.getItem('globalList') || '[]')

// TODO: 持久化方案调整
// 全局状态
export const globalListState = atom({
  key: "globalListState",
  default: defaultGlobalList,
});
