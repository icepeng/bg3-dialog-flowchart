import { memo } from "react";
import { Handle, NodeProps, NodeToolbar, Position } from "reactflow";
import { RollNodeData } from "../data/types";
import NodePopover from "./NodePopover";
import NodeTextList from "./NodeTextList";
import { useNodeData } from "./useNodeData";

const RollNode = memo<NodeProps<RollNodeData>>(({ data, isConnectable }) => {
  const { getSpeakerName } = useNodeData();

  const category = data.Constructor;
  const checkFlags = data.CheckFlags;
  const hasFlags = checkFlags.length > 0;
  const speakerName = getSpeakerName(data.SpeakerNo);

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      {hasFlags && "(Flag Check)"}
      <div>
        {data.RollType}: {data.RollAbility}
      </div>
      <div>
        [{category}] <span>{speakerName}:</span>
      </div>
      <NodeTextList nodeData={data} />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
      <NodeToolbar>
        <NodePopover nodeData={data} />
      </NodeToolbar>
    </>
  );
});

export default RollNode;
