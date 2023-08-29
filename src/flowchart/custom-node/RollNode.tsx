import { RollNode } from "@gustav/types";
import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { useNodeData } from "../useNodeData";
import { NodeTextList, NodeText } from "./NodeTextList";
import NodeFlag from "./NodeFlag";

const RollNode = memo<NodeProps<RollNode>>(({ data, isConnectable }) => {
  const { getSpeakerName } = useNodeData();

  const category = data.Constructor;
  const speakerName = getSpeakerName(data.SpeakerNo);

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <NodeFlag nodeData={data} />
      <div>
        [{category}] <span>{speakerName}:</span>
      </div>
      <div>
        {data.RollType
          ? `${data.RollType}: ${data.RollAbility}`
          : data.RollAbility}
      </div>
      {data.RollAdvantageReason && 
        <NodeText LocalizedString={data.RollAdvantageReason} />
      }
      <NodeTextList nodeData={data} />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </>
  );
});

export default RollNode;
