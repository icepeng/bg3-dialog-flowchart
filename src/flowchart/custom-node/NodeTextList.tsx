import { stringifyRuleGroup } from "@gustav/utils";
import { Divider, VStack } from "@chakra-ui/react";
import { Node, TagText } from "@gustav/types";
import { useWeblate } from "@weblate/useWeblate";
import { Fragment } from "react";

interface NodeTextListProps {
  nodeData: Node;
}

const NodeTextList: React.FC<NodeTextListProps> = ({ nodeData }) => {
  const isEndNode = nodeData.EndNode;

  return (
    <VStack divider={<Divider borderWidth={2} />}>
      {nodeData.TaggedTextList.map((TaggedText, i) => {
        const hasRule = TaggedText.HasTagRule;
        return (
          <Fragment key={i}>
            {hasRule && <div>{stringifyRuleGroup(TaggedText.RuleGroup)}</div>}
            <VStack divider={<Divider />}>
              {TaggedText.TagTexts.map((TagText) => (
                <NodeText key={TagText.LineId} TagText={TagText} />
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
  TagText: TagText;
}

const NodeText: React.FC<NodeTextProps> = ({ TagText }) => {
  const { getTranslatedText } = useWeblate();

  const sourceText = TagText.Text.Value;
  const targetText = getTranslatedText(TagText);

  return (
    <div>
      <div>{sourceText}</div>
      {targetText && <div>{targetText}</div>}
    </div>
  );
};

export default NodeTextList;
