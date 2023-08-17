import { memo } from "react";
import { Handle, NodeProps, NodeToolbar, Position } from "reactflow";
import { NodeData } from "../data/types";
import NodePopover from "./NodePopover";
import NodeTextList from "./NodeTextList";
import { useNodeData } from "./useNodeData";

const AliasNode = memo<NodeProps<NodeData>>(({ data, isConnectable }) => {
  const { dialogData, getSpeakerName } = useNodeData();

  const category = data.Constructor;

  const sourceNodeData = dialogData.Nodes[data.SourceNode!];
  const speakerName = getSpeakerName(sourceNodeData.SpeakerNo);
  const checkFlags = data.CheckFlags;
  const hasFlags = checkFlags.length > 0;

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      {hasFlags && "(Flag Check)"}
      <div>
        [{category}] <span>{speakerName}:</span>
      </div>
      <NodeTextList nodeData={sourceNodeData} />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
      <NodeToolbar>
        <NodePopover nodeData={sourceNodeData} />
      </NodeToolbar>
    </>
  );
});

export default AliasNode;
