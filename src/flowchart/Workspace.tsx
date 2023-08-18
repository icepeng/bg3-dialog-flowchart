import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { ReactFlowProvider } from "reactflow";
import { useGustav } from "../gustav/useGustav";
import { useWeblate } from "../weblate/useWeblate";
import Config from "./Config";
import Flowchart from "./Flowchart";
import { ConfigProvider } from "./useConfig";
import { NodeDataProvider } from "./useNodeData";

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

function Workspace() {
  const { dialogData } = useGustav();

  if (!dialogData) return null;

  return (
    <ConfigProvider>
      <NodeDataProvider dialogData={dialogData}>
        <ReactFlowProvider>
          <Config />
          <Progress />
          <Flowchart />
        </ReactFlowProvider>
      </NodeDataProvider>
    </ConfigProvider>
  );
}

export default Workspace;
