import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { JumpNode } from "@gustav/types";

const JumpNode = memo<NodeProps<JumpNode>>(({ data, isConnectable }) => {
  const category = data.Constructor;

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <div>[{category}]</div>
      <div>{data.JumpTargetPoint == 1 ? "대상 노드 시작으로 연결" : "대상 노드 끝으로 연결"}</div>
      <div>[클릭해서 점프]</div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </>
  );
});

export default JumpNode;
