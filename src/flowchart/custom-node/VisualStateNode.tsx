import { VisualStateNode } from "@gustav/types";
import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";

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
      </>
    );
  }
);

export default VisualStateNode;
