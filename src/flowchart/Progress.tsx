import { CheckIcon, ChevronDownIcon, CloseIcon, EditIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { useWeblate } from "@weblate/useWeblate";
import { useReactFlow } from "reactflow";
import { useNodeData } from "./useNodeData";
import { TranslationState } from "@/weblate/types";

function Progress() {
  const { translationProgress, loadTranslationData, getWeblateSearchUrl, getNodeTranslationState } = useWeblate();
  const { processedNodes } = useNodeData();
  const { fitView } = useReactFlow();

  if (!translationProgress) return null;

  const translatedRatio =
    (translationProgress.translated / translationProgress.total) * 100;
  const fuzzyRatio =
    (translationProgress.fuzzy / translationProgress.total) * 100;

  function openWeblateSearch(...params: string[]) {
    window.open(getWeblateSearchUrl(...params), "_blank");
  }

  function gotoRandomUntranslatedNode() {
    const untranslatedNodes = processedNodes.filter(n => getNodeTranslationState(n.data) == TranslationState.EMPTY);

    if (untranslatedNodes.length === 0) {
      alert("모든 노드가 번역되었습니다.");
      return;
    }

    const randomNode = untranslatedNodes[Math.floor(Math.random() * untranslatedNodes.length)];
    fitView({ nodes: [{ id: randomNode.id }], maxZoom: 1.5, duration: 500 });
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
          Weblate 검색
        </MenuButton>
        <MenuList>
          <MenuItem icon={<HamburgerIcon />} onClick={() => openWeblateSearch()}>전체</MenuItem>
          <MenuItem icon={<CheckIcon />} onClick={() => openWeblateSearch("state:translated")}>번역됨</MenuItem>
          <MenuItem icon={<EditIcon />} onClick={() => openWeblateSearch("state:<translated")}>작업 필요</MenuItem>
          <MenuItem icon={<CloseIcon />} onClick={() => openWeblateSearch("state:empty")}>비어있음</MenuItem>
        </MenuList>
      </Menu>
      <Button onClick={() => gotoRandomUntranslatedNode()} title="미번역된 무작위 노드로 이동합니다.">미번역 찾기</Button>
      <Button onClick={() => loadTranslationData()}>새로고침</Button>
    </Flex>
  );
}

export default Progress;
