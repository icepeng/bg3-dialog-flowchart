import { Node } from "@gustav/types";

export interface NodeFlagProps {
  nodeData: Node;
}

const NodeFlag: React.FC<NodeFlagProps> = ({ nodeData }) => {
  const checkFlags = nodeData.CheckFlags;
  const setFlags = nodeData.SetFlags;
  return (
    <div>
      {checkFlags.length > 0 && <span>(Flag Check)</span>}
      {setFlags.length > 0 && <span>(Flag Set)</span>}
    </div>
  );
};

export default NodeFlag;
