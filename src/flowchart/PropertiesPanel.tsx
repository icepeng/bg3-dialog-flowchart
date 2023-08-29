import { stringifyRuleGroup } from "@/gustav/utils";
import { CopyIcon, ExternalLinkIcon, PhoneIcon } from "@chakra-ui/icons";
import { Center, Divider, HStack, Link, Text, VStack } from "@chakra-ui/react";
import type * as Gustav from "@gustav/types";
import { useAudio } from "@gustav/useAudio";
import { useWeblate } from "@weblate/useWeblate";
import { useRef, useState } from "react";
import { useOnSelectionChange } from "reactflow";
import { useNodeData } from "./useNodeData";

function PropertiesPanel() {
  const [data, setData] = useState<Gustav.Node>();
  const { getSpeakerName } = useNodeData();

  useOnSelectionChange({
    onChange(selection) {
      setData(selection.nodes[0]?.data);
    },
  });

  if (!data)
    return (
      <Center
        borderLeft={1}
        borderStyle="solid"
        borderColor="gray.600"
        width="480px"
        padding={4}
      >
        Select a node to see its properties.
      </Center>
    );

  const speakerName = getSpeakerName(data.SpeakerNo);
  const rollAdvantageReason = (data as Gustav.RollNode).RollAdvantageReason;

  return (
    <VStack
      alignItems="stretch"
      borderLeft={1}
      borderStyle="solid"
      borderColor="gray.600"
      width="480px"
      maxHeight="calc(100vh - 120px)"
      wordBreak="break-word"
      padding={4}
      overflowX="hidden"
      overflowY="auto"
      divider={<Divider borderWidth={2} />}
    >
      <div>
        <Text fontSize="xs" fontWeight="semibold">
          UUID
        </Text>
        <span>{data.UUID}</span>
        {data.EndNode && <div>{"<대화 종료>"}</div>}
      </div>
      {rollAdvantageReason && (
        <RollAdvantageProperties
          title="ROLL ADVANTAGE REASON"
          RollAdvantage={rollAdvantageReason}
        />
      )}
      {data.CheckFlags.length > 0 && (
        <FlagProperties title="CHECK FLAGS" FlagList={data.CheckFlags} />
      )}
      {data.SetFlags.length > 0 && (
        <FlagProperties title="SET FLAGS" FlagList={data.SetFlags} />
      )}
      {data.TaggedTextList.length > 0 && (
        <TextProperties
          speakerName={speakerName}
          TaggedTextList={data.TaggedTextList}
        />
      )}
    </VStack>
  );
}

const RollAdvantageProperties: React.FC<{
  title: string;
  RollAdvantage: Gustav.LocalizedString;
}> = ({ title, RollAdvantage }) => {
  return (
    <div>
      <Text fontSize="xs" fontWeight="semibold">
        {title}
      </Text>
      <div>
        <NodeText LocalizedString={RollAdvantage} />
      </div>
    </div>
  );
};

const FlagProperties: React.FC<{
  title: string;
  FlagList: Gustav.FlagGroup[];
}> = ({ title, FlagList }) => {
  return (
    <div>
      <Text fontSize="xs" fontWeight="semibold">
        {title}
      </Text>
      {FlagList.map((flagGroup, i) => (
        <div key={i}>
          {flagGroup.Flags.map((flag) => (
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

const TextProperties: React.FC<{
  speakerName: string;
  TaggedTextList: Gustav.TaggedText[];
}> = ({ speakerName, TaggedTextList }) => {
  return (
    <div>
      <VStack divider={<Divider />} alignItems="flex-start">
        <div>
          <Text fontSize="xs" fontWeight="semibold">
            TEXTS
          </Text>
          <div>Speaker: {speakerName}</div>
        </div>
        {TaggedTextList.map((TaggedText, i) => {
          const hasRule =
            TaggedText.RuleGroup.Rules.flatMap((rule) => rule.TagNames).length >
            0;
          return (
            <VStack alignItems="flex-start" key={i}>
              {hasRule && <div>{stringifyRuleGroup(TaggedText.RuleGroup)}</div>}
              {TaggedText.TagTexts.map((TagText) => (
                <NodeText
                  key={TagText.LineId}
                  speakerName={speakerName}
                  LocalizedString={TagText.Text}
                />
              ))}
            </VStack>
          );
        })}
      </VStack>
    </div>
  );
};

const NodeText: React.FC<{
  speakerName?: string;
  LocalizedString: Gustav.LocalizedString;
}> = ({ speakerName, LocalizedString }) => {
  const { getTranslatedText, getWeblateUrl } = useWeblate();
  const sourceText = LocalizedString.Value;
  const handle = LocalizedString.Handle;

  const { isReady, audioProps } = useAudio(handle);
  const audioRef = useRef<HTMLAudioElement>(null);

  const url = getWeblateUrl(LocalizedString);
  const targetText = getTranslatedText(LocalizedString);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${speakerName}: ${sourceText}`);
  };

  return (
    <div>
      <div>{sourceText}</div>
      {targetText && <div>{targetText}</div>}
      <HStack>
        {url && (
          <Link href={url} target="weblate">
            Weblate <ExternalLinkIcon mx="2px" />
          </Link>
        )}
        {speakerName && (
          <Text cursor="pointer" onClick={handleCopy}>
            Copy <CopyIcon mx="2px" />
          </Text>
        )}
        {isReady && (
          <Text cursor="pointer" onClick={() => audioRef.current?.play()}>
            Play <PhoneIcon mx="2px" />
          </Text>
        )}
        <audio {...audioProps} ref={audioRef} />
      </HStack>
    </div>
  );
};

export default PropertiesPanel;
