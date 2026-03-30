"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  NativeSelect,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type {
  AuthState,
  CatalogItem,
  DisplayMapping,
  DisplayMappingKey,
} from "@/types/catalog";
import CatalogCard from "./CatalogCard";

type Props = {
  items: CatalogItem[];
  displayMappings: DisplayMapping[];
  authState: AuthState;
  initialMappingKey: DisplayMappingKey;
};

export default function CatalogClient({
  items,
  displayMappings,
  authState,
  initialMappingKey,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [mappingKey, setMappingKey] =
    useState<DisplayMappingKey>(initialMappingKey);

  const selectedMapping =
    displayMappings.find((mapping) => mapping.key === mappingKey) ??
    displayMappings[0];

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(items.map((item) => item.category)))],
    [items],
  );

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesCategory =
        category === "all" || item.category === category;

      const matchesSearch =
        q.length === 0 ||
        item.title.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [items, category, search]);

  async function updateViewerOptions(payload: {
    authState?: AuthState;
    mappingKey?: DisplayMappingKey;
  }) {
    await fetch("/api/viewer-options", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    startTransition(() => {
      router.refresh();
    });
  }

  async function handleToggleAuth() {
    const nextAuthState: AuthState =
      authState === "logged_in" ? "logged_out" : "logged_in";

    await updateViewerOptions({ authState: nextAuthState });
  }

  async function handleMappingChange(nextMappingKey: DisplayMappingKey) {
    setMappingKey(nextMappingKey);
    await updateViewerOptions({ mappingKey: nextMappingKey });
  }

  return (
    <Container maxW="7xl" py={{ base: 6, md: 8 }}>
      <Flex
        direction={{ base: "column", lg: "row" }}
        align={{ base: "stretch", lg: "end" }}
        justify="space-between"
        gap={4}
        mb={6}
      >
        <Box>
          <Heading size="lg">Catalog</Heading>
          <Text mt={1} fontSize="sm" color="fg.muted">
            Viewing as: {authState === "logged_in" ? "Logged in" : "Logged out"}
          </Text>
        </Box>

        <Flex direction={{ base: "column", md: "row" }} gap={3}>
          <Button
            onClick={handleToggleAuth}
            loading={isPending}
            variant="outline"
          >
            Switch to {authState === "logged_in" ? "Logged out" : "Logged in"}
          </Button>

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items"
            maxW={{ base: "100%", md: "240px" }}
            bg="white"
          />

          <NativeSelect.Root maxW={{ base: "100%", md: "180px" }}>
            <NativeSelect.Field
              value={category}
              onChange={(e) => setCategory(e.currentTarget.value)}
              bg="white"
            >
              {categories.map((value) => (
                <option key={value} value={value}>
                  {value === "all" ? "All categories" : value}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>

          <NativeSelect.Root maxW={{ base: "100%", md: "200px" }}>
            <NativeSelect.Field
              value={mappingKey}
              onChange={(e) =>
                handleMappingChange(
                  e.currentTarget.value as DisplayMappingKey,
                )
              }
              bg="white"
            >
              {displayMappings.map((mapping) => (
                <option key={mapping.id} value={mapping.key}>
                  {mapping.name}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Flex>
      </Flex>

      <SimpleGrid
        gap={6}
        templateColumns={{
          base: "1fr",
          md: "repeat(auto-fill, minmax(320px, 1fr))",
          xl: "repeat(auto-fill, minmax(350px, 1fr))",
        }}
      >
        {filteredItems.map((item, index) => (
          <CatalogCard
            key={item.id}
            item={item}
            mapping={selectedMapping}
            priority={index < 3}
          />
        ))}
      </SimpleGrid>

      {filteredItems.length === 0 && (
        <Text mt={3} color="gray.600" maxW="md" mx="auto">
          No items match
          {search ? ` "${search}"` : ""} in
          {category !== "all" ? ` ${category}` : " the current selection"}.
        </Text>
      )}
    </Container>
  );
}