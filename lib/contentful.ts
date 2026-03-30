import * as contentful from "contentful";
import type { DisplayMapping, DisplayMappingKey, Item, SubtitleField } from "@/types/catalog";
import type { EntryFieldTypes, EntrySkeletonType } from "contentful";
import { toCardSet, toAttributes } from "./catalog.utils";

type ItemSkeleton = EntrySkeletonType<
  {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    author: EntryFieldTypes.Symbol;
    category: EntryFieldTypes.Symbol;
    imageUrl: EntryFieldTypes.Symbol;
    priceLoggedOut: EntryFieldTypes.Number;
    priceLoggedIn: EntryFieldTypes.Number;
    cardSet: EntryFieldTypes.Symbol;
    description: EntryFieldTypes.Text;
    attributes: EntryFieldTypes.Object;
  },
  "item"
>;

type DisplayMappingSkeleton = EntrySkeletonType<
  {
    name: EntryFieldTypes.Symbol;
    key: EntryFieldTypes.Symbol;
    showPrice: EntryFieldTypes.Boolean;
    showSubtitle: EntryFieldTypes.Boolean;
    subtitleField: EntryFieldTypes.Symbol;
    badgeKeys: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  },
  "displayMapping"
>;

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  environment: process.env.CONTENTFUL_ENVIRONMENT!,
});

export const getItemData: () => Promise<Item[]> = async () => {
  const response = await client.getEntries<ItemSkeleton>({
      content_type: "item",
      order: ["fields.title"],
      limit: 50,
    });

    return response.items.map((item) => ({
      id: item.sys.id,
      title: item.fields.title,
      slug: item.fields.slug,
      author: item.fields.author,
      category: item.fields.category,
      priceLoggedOut: item.fields.priceLoggedOut,
      priceLoggedIn: item.fields.priceLoggedIn,
      imageUrl: item.fields.imageUrl,
      cardSet: toCardSet(item.fields.cardSet),
      description: item.fields.description,
      attributes: toAttributes(item.fields.attributes),
  }));
};

export async function getDisplayMappings(): Promise<DisplayMapping[]> {
  const response = await client.getEntries<DisplayMappingSkeleton>({
    content_type: "displayMapping",
    order: ["fields.name"],
    limit: 10,
  });

  return response.items.map((item) => ({
    id: item.sys.id,
    name: item.fields.name,
    key: item.fields.key as DisplayMappingKey,
    showPrice: item.fields.showPrice,
    showSubtitle: item.fields.showSubtitle,
    subtitleField: (item.fields.subtitleField ?? "none") as SubtitleField,
    badgeKeys: Array.isArray(item.fields.badgeKeys) ? item.fields.badgeKeys.map(String) : [],
  }));
}

export async function getCatalogData(): Promise<{
  items: Item[];
  displayMappings: DisplayMapping[];
}> {
  const [itemsResponse, mappingsResponse] = await Promise.all([
    client.getEntries<ItemSkeleton>({
      content_type: "item",
      order: ["fields.title"],
      limit: 50,
    }),
    client.getEntries<DisplayMappingSkeleton>({
      content_type: "displayMapping",
      order: ["fields.name"],
      limit: 10,
    }),
  ]);

  const items: Item[] = itemsResponse.items.map((item) => ({
    id: item.sys.id,
    title: item.fields.title,
    slug: item.fields.slug,
    author: item.fields.author,
    category: item.fields.category,
    priceLoggedOut: item.fields.priceLoggedOut,
    priceLoggedIn: item.fields.priceLoggedIn,
    imageUrl: item.fields.imageUrl,
    cardSet: toCardSet(item.fields.cardSet),
    description: item.fields.description,
    attributes: toAttributes(item.fields.attributes),
  }));

  const displayMappings: DisplayMapping[] = mappingsResponse.items.map((item) => ({
    id: item.sys.id,
    name: item.fields.name,
    key: item.fields.key as DisplayMappingKey,
    showPrice: item.fields.showPrice,
    showSubtitle: item.fields.showSubtitle,
    subtitleField: (item.fields.subtitleField ?? "none") as SubtitleField,
    badgeKeys: Array.isArray(item.fields.badgeKeys) ? item.fields.badgeKeys.map(String) : [],
  }));

  return { items, displayMappings };
}