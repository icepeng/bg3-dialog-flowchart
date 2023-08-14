import { memo } from "react";
import { Handle, NodeProps, NodeToolbar, Position } from "reactflow";
import { NodeData } from "../data/types";
import { speakerRecord } from "./useNodeData";

const DialogNode = memo<NodeProps<NodeData>>(({ data, isConnectable }) => {
  const category = data.Constructor;
  const uuid = data.UUID;
  const speakerName =
    speakerRecord[data.SpeakerNo].SpeakerCharacter.DisplayName;
  const label = data.TaggedTextList?.[0]?.TagTexts?.[0]?.Text.Value;
  const checkFlags = data.CheckFlags;
  const hasFlags = checkFlags.length > 0;
  const isEndNode = data.EndNode;

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <div>
        [{category}] {hasFlags && "(Flag Check)"}
      </div>
      <div>{uuid}</div>
      <div>
        {speakerName}: {label}
      </div>
      {isEndNode && <div>{"<대화 종료>"}</div>}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
      <NodeToolbar>
        <div>
          {checkFlags.map((checkFlag, i) => (
            <div key={i}>
              {checkFlag.Flags.map((flag) => (
                <div key={flag.UUID}>
                  <div>
                    {flag.Name}={String(flag.value)}
                  </div>
                  <div></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </NodeToolbar>
    </>
  );
});

export default DialogNode;
