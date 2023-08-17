import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { NodeData } from "../data/types";

const JumpNode = memo<NodeProps<NodeData>>(({ data, isConnectable }) => {
  const category = data.Constructor;

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <div>[{category}]</div>
      <div>클릭해서 점프</div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </>
  );
});

export default JumpNode;
