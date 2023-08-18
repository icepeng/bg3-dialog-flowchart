import { memo } from "react";
import { Handle, NodeProps, NodeToolbar, Position } from "reactflow";
import { VisualStateNode } from "../gustav/types";
import NodePopover from "./NodePopover";

const VisualStateNode = memo<NodeProps<VisualStateNode>>(
  ({ data, isConnectable }) => {
    const category = data.Constructor;
    const context = data.EditorData.stateContext!;

    return (
      <>
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
        />
        <div>[{category}]</div>
        <div>Visual State: {context}</div>
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
        />
        <NodeToolbar>
          <NodePopover nodeData={data} />
        </NodeToolbar>
      </>
    );
  }
);

export default VisualStateNode;
