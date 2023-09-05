import { Text } from "@chakra-ui/react";
import { Node } from "@gustav/types";

export interface NodeFlagProps {
  nodeData: Node;
}

const NodeFlag: React.FC<NodeFlagProps> = ({ nodeData }) => {
  const checkFlags = nodeData.CheckFlags;
  const setFlags = nodeData.SetFlags;
  const checkFlagCount = checkFlags.flatMap(
    (flagGroup) => flagGroup.Flags
  ).length;
  const firstFlag = checkFlags[0]?.Flags[0];
  return (
    <div>
      {checkFlags.length > 0 &&
        (checkFlagCount === 1 ? (
          <Text as="span" color={firstFlag.value ? "blue.300" : "red.300"}>({firstFlag.value || "!"}{firstFlag.Name})</Text>
        ) : (
          <span>(Flag Check)</span>
        ))}
      {setFlags.length > 0 && <span>(Flag Set)</span>}
    </div>
  );
};

export default NodeFlag;
