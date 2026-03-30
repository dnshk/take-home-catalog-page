import {
  Box,
  Container,
  Flex,
  Skeleton,
  SkeletonText,
  Stack,
  SimpleGrid,
} from "@chakra-ui/react";

function CatalogCardSkeleton() {
  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="2xl"
      overflow="hidden"
      shadow="sm"
    >
      <Skeleton height="500px" width="100%" />

      <Stack p={5} gap={4}>
        <Box>
          <Skeleton height="24px" width="70%" mb={2} />
          <Skeleton height="18px" width="35%" />
        </Box>

        <Flex gap={2} wrap="wrap">
          <Skeleton height="24px" width="72px" borderRadius="full" />
          <Skeleton height="24px" width="88px" borderRadius="full" />
          <Skeleton height="24px" width="64px" borderRadius="full" />
        </Flex>

        <Skeleton height="20px" width="28%" />

        <SkeletonText noOfLines={3} gap="2" />
      </Stack>
    </Box>
  );
}

export default function Loading() {
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
          <Skeleton height="32px" width="180px" mb={2} />
          <Skeleton height="16px" width="140px" />
        </Box>

        <Flex direction={{ base: "column", md: "row" }} gap={3}>
          <Skeleton height="40px" width={{ base: "100%", md: "170px" }} borderRadius="md" />
          <Skeleton height="40px" width={{ base: "100%", md: "240px" }} borderRadius="md" />
          <Skeleton height="40px" width={{ base: "100%", md: "180px" }} borderRadius="md" />
          <Skeleton height="40px" width={{ base: "100%", md: "200px" }} borderRadius="md" />
        </Flex>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={6}>
        {Array.from({ length: 6 }).map((_, index) => (
          <CatalogCardSkeleton key={index} />
        ))}
      </SimpleGrid>
    </Container>
  );
}