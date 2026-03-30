export type CardSet = "A" | "B";

export type Item = {
    id: string;
    slug: string;
    title: string;
    author: string;
    category: string;
    priceLoggedOut: number;
    priceLoggedIn: number;
    imageUrl: string;
    cardSet: CardSet;
    description: string;
    attributes: Record<string, string>;
}

export type ProductAttribute = {
  key: string;
  label: string;
  value: string | number;
};

export type CatalogItem = {
  id: string;
  slug: string;
  title: string;
  author: string;
  category: string;
  displayPrice: number;
  imageUrl: string;
  cardSet: CardSet;
  description: string;
  attributes: Record<string, string>;
};

export type AuthState = "logged_out" | "logged_in";

export type DisplayMappingKey = "price_first" | "specs_first";

export type SubtitleField =  "author" | "category" | "description" | "none";

export type DisplayMapping = {
  id: string;
  name: string;
  key: DisplayMappingKey;
  showPrice: boolean;
  showSubtitle: boolean;
  subtitleField: SubtitleField;
  badgeKeys: string[];
};