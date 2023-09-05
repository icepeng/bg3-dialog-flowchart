import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { RollResultNode } from "@gustav/types";
import { Text } from "@chakra-ui/react";

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
        <Text as='div' color={data.RollSuccess ? "blue.300" : "red.300"}>굴림 결과: {data.RollSuccess ? "성공" : "실패"}</Text>
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
