import { Node } from "@gustav/types";
import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { useNodeData } from "../useNodeData";
import NodeFlag from "./NodeFlag";
import NodeTextList from "./NodeTextList";

const DialogNode = memo<NodeProps<Node>>(({ data, isConnectable }) => {
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
      <NodeTextList nodeData={data} />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </>
  );
});

export default DialogNode;
