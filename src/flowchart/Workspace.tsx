import { useGustav } from "@gustav/useGustav";
import { ReactFlowProvider } from "reactflow";
import Navigator from "./Navigator";
import Flowchart from "./Flowchart";
import Progress from "./Progress";
import PropertiesPanel from "./PropertiesPanel";
import { NodeDataProvider } from "./useNodeData";
import { WorkspaceProvider } from "./useWorkspace";
import { Flex } from "@chakra-ui/react";

function Workspace() {
  const { dialogData } = useGustav();

  if (!dialogData) return null;

  return (
    <WorkspaceProvider>
      <NodeDataProvider dialogData={dialogData}>
        <ReactFlowProvider>
          <Navigator />
          <Progress />
          <Flex flex="1 0 auto" maxH="100%">
            <Flowchart />
            <PropertiesPanel />
          </Flex>
        </ReactFlowProvider>
      </NodeDataProvider>
    </WorkspaceProvider>
  );
}

export default Workspace;
