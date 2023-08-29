import { floydWarshall } from "./floyd";
import { Node, RuleGroup } from "./types";

export function parsePosition(position: string) {
  const [x, y] = position.split(";");
  return {
    x: Number(x),
    y: Number(y),
  };
}

export function checkFlagFulfilled(
  data: Node,
  flagState: Record<string, boolean>
) {
  const result = data.CheckFlags.every((checkFlag) => {
    return checkFlag.Flags.every((flag) => {
      if (flagState[flag.UUID] === flag.value) {
        return true;
      }
      return false;
    });
  });

  return result;
}

export function getNodesPathThrough(
  record: Record<string, Node>,
  pinnedIds: string[]
): Node[] {
  const graphForward: Record<string, Record<string, 1>> = {};
  const graphBackward: Record<string, Record<string, 1>> = {};

  for (const id in record) {
    graphForward[id] = {};
    graphBackward[id] = {};
  }

  for (const id in record) {
    const node = record[id];
    for (const child of node.Children) {
      graphForward[id][child] = 1;
      graphBackward[child][id] = 1;
    }
    if (node.Constructor === "Jump") {
      graphForward[id][node.JumpTarget] = 1;
      graphBackward[node.JumpTarget][id] = 1;
    }
  }

  const forward = floydWarshall(graphForward);
  const backward = floydWarshall(graphBackward);

  return Object.keys(record)
    .filter((id) =>
      pinnedIds.every(
        (pinnedId) =>
          forward[pinnedId][id] !== Infinity ||
          backward[pinnedId][id] !== Infinity
      )
    )
    .map((id) => record[id]);
}

export function getAllFlags(datalist: Node[]) {
  return [
    ...new Map(
      datalist
        .map((data) => data.CheckFlags)
        .filter((flags) => flags.length > 0)
        .flatMap((flags) => flags.flatMap((flag) => flag.Flags))
        .map((flag) => [flag.UUID, flag] as const)
    ).values(),
  ].sort((a, b) => a.Name.localeCompare(b.Name));
}

function parenthize(str: string) {
  return `(${str})`;
}

function parenthizeIfNeeded(str: string) {
  if (str.startsWith("(") && str.endsWith(")")) {
    return str;
  }
  if (str.startsWith("!")) {
    return str;
  }
  return parenthize(str);
}

function combine(arr: string[], op: 0 | 1 | 2) {
  if (op === 0) {
    return arr.join(" & ");
  }
  if (op === 1) {
    return arr.join(" | ");
  }
  if (op === 2) {
    return `!${parenthize(arr.join(" & "))}`;
  }
  throw new Error(`Invalid op: ${op}`);
}

export function stringifyRuleGroup(ruleGroup: RuleGroup) {
  const { Rules, TagCombineOp } = ruleGroup;
  return combine(
    Rules.map((rule) => combine(rule.TagNames, rule.TagCombineOp)).map(
      parenthizeIfNeeded
    ),
    TagCombineOp
  );
}
