import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useWeblate } from "@weblate/useWeblate";

function Progress() {
  const { translationProgress, loadTranslationData } = useWeblate();

  if (!translationProgress) return null;

  const translatedRatio =
    (translationProgress.translated / translationProgress.total) * 100;
  const fuzzyRatio =
    (translationProgress.fuzzy / translationProgress.total) * 100;

  return (
    <Flex>
      <Flex flex={1} direction={"column"}>
        <Text ml={2}>
          번역률:{" "}
          {`${translationProgress.translated}/${translationProgress.total}`},{" "}
          {translatedRatio.toFixed(2)}%, 수정 필요 {translationProgress.fuzzy}개
        </Text>
        <Box display="flex" flex={1} background="gray.500">
          <Box
            height="100%"
            width={`${translatedRatio}%`}
            background="blue.500"
          />
          <Box height="100%" width={`${fuzzyRatio}%`} background="yellow.500" />
        </Box>
      </Flex>
      <Button onClick={() => loadTranslationData()}>Reload</Button>
    </Flex>
  );
}

export default Progress;
