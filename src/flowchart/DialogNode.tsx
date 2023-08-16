import { Divider, VStack } from "@chakra-ui/react";
import { memo } from "react";
import { Handle, NodeProps, NodeToolbar, Position } from "reactflow";
import { NodeData } from "../data/types";
import { useNodeData } from "./useNodeData";

const DialogNode = memo<NodeProps<NodeData>>(({ data, isConnectable }) => {
  const { getSpeakerName } = useNodeData();

  const category = data.Constructor;
  const uuid = data.UUID;
  const speakerName = getSpeakerName(data.SpeakerNo);
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
      <VStack divider={<Divider borderWidth={2} />}>
        {data.TaggedTextList.map((TaggedText, i) => (
          <VStack divider={<Divider />} key={i}>
            {TaggedText.TagTexts.map((TagText) => (
              <div key={TagText.LineId}>
                {speakerName}: {TagText.Text.Value}
              </div>
            ))}
          </VStack>
        ))}
      </VStack>
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
