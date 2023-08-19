import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useWeblate } from "@weblate/useWeblate";

function Progress() {
  const { translationProgress, loadTranslationData } = useWeblate();

  if (!translationProgress) return null;

  const ratio =
    (translationProgress.translated / translationProgress.total) * 100;

  return (
    <Flex>
      <Flex flex={1} direction={"column"}>
        <Text ml={2}>
          번역률:{" "}
          {`${translationProgress.translated}/${translationProgress.total}`},{" "}
          {ratio.toFixed(2)}%
        </Text>
        <Box flex={1} background="gray.500">
          <Box height="100%" width={`${ratio}%`} background="blue.500" />
        </Box>
      </Flex>
      <Button onClick={() => loadTranslationData()}>Reload</Button>
    </Flex>
  );
}

export default Progress;
