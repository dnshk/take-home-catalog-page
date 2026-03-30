import {
  Item,
  CatalogItem,
  AuthState,
  CardSet,
  DisplayMapping,
} from "@/types/catalog";

const ALLOWED_KEYS = [
  "format",
  "language",
  "pages",
  "year",
  "rating",
];

export function filterProductsForAuth(
  items: Item[],
  authState: AuthState,
): Item[] {
  if (authState === "logged_in") return items;
  return items.filter((item) => item.cardSet === "A");
}

export function toCatalogItems(
  items: Item[],
  authState: AuthState,
): CatalogItem[] {
  return items.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    author: item.author,
    category: item.category,
    displayPrice:
      authState === "logged_in"
        ? item.priceLoggedIn
        : item.priceLoggedOut,
    imageUrl: item.imageUrl,
    cardSet: item.cardSet,
    description: item.description,
    attributes: item.attributes,
  }));
}

export function toCardSet(value: string): CardSet {
  if (value === "A" || value === "B") return value;
  throw new Error(`Invalid cardSet value: ${value}`);
}

export function toAttributes(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const result: Record<string, string> = {};

  for (const key of ALLOWED_KEYS) {
    const raw = (value as Record<string, unknown>)[key];
    if (raw != null) {
      result[key] = String(raw);
    }
  }

  return result;
}

export function getSubtitle(
  item: CatalogItem,
  mapping: DisplayMapping,
): string | null {
  if (!mapping.showSubtitle) return null;

  switch (mapping.subtitleField) {
    case "author":
      return item.author;
    case "category":
      return item.category;
    case "description":
      return item.description;
    default:
      return null;
  }
}

export function getBadges(
  item: CatalogItem,
  mapping: DisplayMapping,
): Array<{ key: string; value: string }> {
  return mapping.badgeKeys
    .map((key) => ({
      key,
      value: item.attributes[key] ?? "",
    }))
    .filter((badge) => badge.value);
}