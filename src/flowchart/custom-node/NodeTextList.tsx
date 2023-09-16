import { Box, Divider, VStack } from "@chakra-ui/react";
import { LocalizedString, Node } from "@gustav/types";
import { stringifyRuleGroup } from "@gustav/utils";
import { useWeblate } from "@weblate/useWeblate";
import { Fragment } from "react";
import { useWorkspace } from "../useWorkspace";
import { TranslationState } from "@/weblate/types";

interface NodeTextListProps {
  nodeData: Node;
}

export const NodeTextList: React.FC<NodeTextListProps> = ({ nodeData }) => {
  const isEndNode = nodeData.EndNode;
  const rollAdvantageReason =
    nodeData.Constructor === "ActiveRoll" ||
    nodeData.Constructor === "PassiveRoll"
      ? nodeData.RollAdvantageReason
      : null;

  return (
    <VStack divider={<Divider borderWidth={2} />}>
      {nodeData.TaggedTextList.map((TaggedText, i) => {
        const hasRule = TaggedText.HasTagRule;
        return (
          <Fragment key={i}>
            {hasRule && <div>{stringifyRuleGroup(TaggedText.RuleGroup)}</div>}
            <VStack divider={<Divider />}>
              {rollAdvantageReason && (
                <NodeText LocalizedString={rollAdvantageReason} />
              )}
              {TaggedText.TagTexts.map((TagText) => (
                <NodeText key={TagText.LineId} LocalizedString={TagText.Text} />
              ))}
            </VStack>
          </Fragment>
        );
      })}
      {isEndNode && <div>{"<대화 종료>"}</div>}
    </VStack>
  );
};

interface NodeTextProps {
  LocalizedString: LocalizedString;
}

const stateStyles = {
  untranslated: {
    backgroundColor: "red.700",
  },
  fuzzy: {
    backgroundColor: "yellow.700",
  },
  translated: {
    backgroundColor: "transparent",
  },
};

export const NodeText: React.FC<NodeTextProps> = ({
  LocalizedString: LocalizedString,
}) => {
  const { getTranslateUnit } = useWeblate();
  const { highlightFuzzy, highlightUntranslated } = useWorkspace();

  const translateUnit = getTranslateUnit(LocalizedString);
  const sourceText = LocalizedString.Value;
  const targetText = translateUnit?.target;

  const isUntranslated = translateUnit?.state === TranslationState.EMPTY;
  const isFuzzy = translateUnit?.state === TranslationState.FUZZY;
  const renderedState =
    highlightUntranslated && isUntranslated
      ? "untranslated"
      : isFuzzy && highlightFuzzy
      ? "fuzzy"
      : "translated";

  return (
    <Box {...stateStyles[renderedState]}>
      <div>{sourceText}</div>
      {targetText && <div>{targetText}</div>}
    </Box>
  );
};
