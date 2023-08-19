import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { RollResultNode } from "@gustav/types";

const RollResultNode = memo<NodeProps<RollResultNode>>(
  ({ data, isConnectable }) => {
    const category = data.Constructor;

    return (
      <>
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
        />
        <div>[{category}]</div>
        <div>RollSuccess: {String(data.RollSuccess)}</div>
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
        />
      </>
    );
  }
);

export default RollResultNode;
