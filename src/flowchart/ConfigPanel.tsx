import { useWeblate } from "@/weblate/useWeblate";
import { Flex, Switch, FormControl, FormLabel } from "@chakra-ui/react";
import { useWorkspace } from "./useWorkspace";

function ConfigPanel() {
  const {
    highlightUntranslated,
    setHighlightUntranslated,
    highlightFuzzy,
    setHighlightFuzzy,
    displayJumpEdge,
    setDisplayJumpEdge,
  } = useWorkspace();
  const { translationData } = useWeblate();

  return (
    <Flex
      direction="column"
      gap="4px"
      background="gray.800"
      border="1px solid"
      borderColor="gray.600"
      padding="8px"
      borderRadius="4px"
    >
      {translationData && (
        <FormControl
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <FormLabel htmlFor="highlight-untranslated" mb="0">
            미번역 강조
          </FormLabel>
          <Switch
            isChecked={highlightUntranslated}
            onChange={(e) => setHighlightUntranslated(e.target.checked)}
            id="highlight-untranslated"
          />
        </FormControl>
      )}
      {translationData && (
        <FormControl
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <FormLabel htmlFor="highlight-fuzzy" mb="0">
            수정 필요 강조
          </FormLabel>
          <Switch
            isChecked={highlightFuzzy}
            onChange={(e) => setHighlightFuzzy(e.target.checked)}
            id="highlight-fuzzy"
          />
        </FormControl>
      )}
      <FormControl
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <FormLabel htmlFor="display-jump-edge" mb="0">
          점프 연결 표시
        </FormLabel>
        <Switch
          checked={displayJumpEdge}
          onChange={(e) => setDisplayJumpEdge(e.target.checked)}
          id="display-jump-edge"
        />
      </FormControl>
    </Flex>
  );
}

export default ConfigPanel;
