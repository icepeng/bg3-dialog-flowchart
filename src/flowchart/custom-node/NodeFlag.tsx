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
  const firstFlag = checkFlags[0]?.Flags[0].Name;
  return (
    <div>
      {checkFlags.length > 0 &&
        (checkFlagCount === 1 ? (
          <span>({firstFlag})</span>
        ) : (
          <span>(Flag Check)</span>
        ))}
      {setFlags.length > 0 && <span>(Flag Set)</span>}
    </div>
  );
};

export default NodeFlag;
