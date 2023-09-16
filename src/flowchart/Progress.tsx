import { CheckIcon, ChevronDownIcon, CloseIcon, EditIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { useWeblate } from "@weblate/useWeblate";

function Progress() {
  const { translationProgress, loadTranslationData, getWeblateSearchUrl } = useWeblate();

  if (!translationProgress) return null;

  const translatedRatio =
    (translationProgress.translated / translationProgress.total) * 100;
  const fuzzyRatio =
    (translationProgress.fuzzy / translationProgress.total) * 100;

  function openWeblateSearch(...params: string[]) {
    window.open(getWeblateSearchUrl(...params), "_blank");
  }

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
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          Search in Weblate
        </MenuButton>
        <MenuList>
          <MenuItem icon={<HamburgerIcon />} onClick={() => openWeblateSearch()}>All</MenuItem>
          <MenuItem icon={<CheckIcon />} onClick={() => openWeblateSearch("state:translated")}>Translated</MenuItem>
          <MenuItem icon={<EditIcon />} onClick={() => openWeblateSearch("state:<translated")}>Needing action</MenuItem>
          <MenuItem icon={<CloseIcon />} onClick={() => openWeblateSearch("state:empty")}>Empty</MenuItem>
        </MenuList>
      </Menu>
      <Button onClick={() => loadTranslationData()}>Reload</Button>
    </Flex>
  );
}

export default Progress;
