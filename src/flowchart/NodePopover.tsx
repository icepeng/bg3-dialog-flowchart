import { NodeData } from "../data/types";

export interface NodePopoverProps {
  nodeData: NodeData;
}

const NodePopover: React.FC<NodePopoverProps> = ({ nodeData }) => {
  return (
    <div>
      <span>UUID: {nodeData.UUID}</span>
      {nodeData.CheckFlags.map((checkFlag, i) => (
        <div key={i}>
          {checkFlag.Flags.map((flag) => (
            <div key={flag.UUID}>
              <div>
                {flag.Name}={String(flag.value)}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default NodePopover;
