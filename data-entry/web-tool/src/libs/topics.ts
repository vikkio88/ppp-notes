import { ulid } from "ulid";
import type { CollectionType } from "./types";

export const topicTypeMap: Record<CollectionType, string> = {
  lorrowap: "⏪",
  menews: "📰",
  main: "🍕",
};

const topicPrefixesMap: Record<CollectionType, string> = {
  lorrowap: "lw_",
  menews: "mn_",
  main: "m_",
};

export function id(type: CollectionType) {
  return `${topicPrefixesMap[type]}${ulid()}`;
}
