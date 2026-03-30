import {
  Badge,
  Box,
  Stack,
  Text,
  Heading,
} from "@chakra-ui/react";
import type { CatalogItem, DisplayMapping } from "@/types/catalog";
import { getBadges, getSubtitle } from "@/lib/catalog.utils";
import NextImage from "next/image";


type Props = {
  item: CatalogItem;
  mapping: DisplayMapping;
  priority?: boolean;
};

export default function CatalogCard({ item, mapping, priority }: Props) {
  const subtitle = getSubtitle(item, mapping);
  const badges = getBadges(item, mapping);

  const isPriceFirst = mapping.key === "price_first";

  return (
    <Box
      borderWidth="1px"
      borderRadius="xl"
      overflow="hidden"
      bg="white"
      _hover={{ shadow: "md" }}
      transition="all 0.2s"
    >
      <Box position="relative" aspectRatio={4 / 3} bg="gray.100">
        {item.imageUrl ? (
          <NextImage
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 48em) 100vw, (max-width: 80em) 50vw, 33vw"
            style={{ objectFit: "contain" }}
            priority={priority}
          />
        ) : null}
      </Box>

      <Stack p={4}>
        <Heading size="md">{item.title}</Heading>

        {subtitle && (
          <Text
            fontSize={"sm"}
            fontWeight={"normal"}
            color={"gray.500"}
          >
            by {subtitle}
          </Text>
        )}

        {mapping.showPrice && isPriceFirst && (
          <Text fontWeight="semibold">
            ${item.displayPrice.toFixed(2)}
          </Text>
        )}

        <Stack direction="row" wrap="wrap">
          {badges.map((b) => (
            <Badge
              key={b.key}
              colorScheme={isPriceFirst ? "gray" : "blue"}
              px={2}
              py={1}
              borderRadius="md"
            >
              {b.key}: {b.value}
            </Badge>
          ))}
        </Stack>

        <Text fontSize="sm" color="gray.600">
          {item.description}
        </Text>
      </Stack>
    </Box>
  );
}