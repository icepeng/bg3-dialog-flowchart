import { ReactFlowProvider } from "reactflow";
import { useGustav } from "@gustav/useGustav";
import Config from "./Config";
import Flowchart from "./Flowchart";
import Progress from "./Progress";
import { NodeDataProvider } from "./useNodeData";
import { WorkspaceProvider } from "./useWorkspace";

function Workspace() {
  const { dialogData } = useGustav();

  if (!dialogData) return null;

  return (
    <WorkspaceProvider>
      <NodeDataProvider dialogData={dialogData}>
        <ReactFlowProvider>
          <Config />
          <Progress />
          <Flowchart />
        </ReactFlowProvider>
      </NodeDataProvider>
    </WorkspaceProvider>
  );
}

export default Workspace;
