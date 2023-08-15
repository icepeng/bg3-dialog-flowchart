import { ReactFlowProvider } from "reactflow";
import { useDialogData } from "../data/useDialogData";
import Config from "./Config";
import Flowchart from "./Flowchart";
import { ConfigProvider } from "./useConfig";
import { NodeDataProvider } from "./useNodeData";

function Workspace() {
  const { dialogData } = useDialogData();

  if (!dialogData) return null;

  return (
    <ConfigProvider>
      <NodeDataProvider dialogData={dialogData}>
        <ReactFlowProvider>
          <Config />
          <Flowchart />
        </ReactFlowProvider>
      </NodeDataProvider>
    </ConfigProvider>
  );
}

export default Workspace;
