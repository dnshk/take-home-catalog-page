import { cookies } from "next/headers";
import { getCatalogData, getItemData } from "@/lib/contentful";
import {
  filterProductsForAuth,
  toCatalogItems,
} from "@/lib/catalog.utils";
import CatalogClient from "@/components/catalog/CatalogClient";

export default async function Page() {
  const cookieStore = await cookies();

  const authState =
    cookieStore.get("authState")?.value === "logged_in"
      ? "logged_in"
      : "logged_out";
  
  const initialMappingKey = 
    cookieStore.get("mappingKey")?.value === "specs_first"
      ? "specs_first"
      : "price_first";

  const { items, displayMappings } = await getCatalogData();

  const visibleItems = filterProductsForAuth(items, authState);
  const catalogItems = toCatalogItems(visibleItems, authState);

  return <CatalogClient
    items={catalogItems}
    displayMappings={displayMappings}
    authState={authState} 
    initialMappingKey={initialMappingKey}    
  />;
}