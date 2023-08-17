import { Divider, VStack } from "@chakra-ui/react";
import { memo } from "react";
import { Handle, NodeProps, NodeToolbar, Position } from "reactflow";
import { NodeData } from "../data/types";
import { useTranslationData } from "../data/useTranslationData";
import { useNodeData } from "./useNodeData";

const AliasNode = memo<NodeProps<NodeData>>(({ data, isConnectable }) => {
  const { dialogData, getSpeakerName } = useNodeData();
  const { getTranslatedText } = useTranslationData();

  const category = data.Constructor;
  const uuid = data.UUID;
  const sourceNodeData = dialogData.Nodes[data.SourceNode!];

  const speakerName = getSpeakerName(data.SpeakerNo);
  const checkFlags = data.CheckFlags;
  const hasFlags = checkFlags.length > 0;

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      [{category}] {hasFlags && "(Flag Check)"}
      <div>{uuid}</div>
      <VStack divider={<Divider borderWidth={2} />}>
        {sourceNodeData.TaggedTextList.map((TaggedText, i) => (
          <VStack divider={<Divider />} key={i}>
            {TaggedText.TagTexts.map((TagText) => (
              <div key={TagText.LineId}>
                {speakerName}: {getTranslatedText(TagText)}
              </div>
            ))}
          </VStack>
        ))}
      </VStack>
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

export default AliasNode;
