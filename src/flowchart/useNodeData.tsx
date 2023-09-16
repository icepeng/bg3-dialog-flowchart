import type * as Gustav from "@gustav/types";
import { getNodesPathThrough, parsePosition } from "@gustav/utils";
import { clsx } from "clsx";
import * as React from "react";
import { useCallback, useMemo } from "react";
import { Edge, Node, Position } from "reactflow";
import { useWorkspace } from "./useWorkspace";

type NodeDataProviderProps = {
  dialogData: Gustav.DialogData;
  children: React.ReactNode;
};

function getNodeFromGustav(
  gustavNode: Gustav.Node,
  gustavNodes: Gustav.DialogData["Nodes"],
  isPinned: boolean
): Node {
  const { x, y } = parsePosition(gustavNode.EditorData.position);

  const isAliased = gustavNode.Constructor === "Alias";
  const data = {
    ...(isAliased ? gustavNodes[gustavNode.SourceNode!] : gustavNode),
    CheckFlags: gustavNode.CheckFlags,
    SetFlags: gustavNode.SetFlags,
  };

  return {
    id: gustavNode.UUID,
    type: data.Constructor,
    position: {
      x: Number(x),
      y: Number(y),
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    className: clsx(
      "react-flow__node-default",
      isPinned ? "react-flow__node-pinned" : undefined
    ),
    style: {
      width: "240px",
    },
    data,
  };
}

function getEdgesFromGustav(
  gustavNode: Gustav.Node,
  displayJumpEdge: boolean
): Edge[] {
  return [
    ...gustavNode.Children.map((child) => {
      const edge: Edge = {
        id: `${gustavNode.UUID}-${child}`,
        source: gustavNode.UUID,
        target: child,
        type: "smoothstep",
      };
      return edge;
    }),
    ...(displayJumpEdge && gustavNode.Constructor === "Jump"
      ? [
          {
            id: `${gustavNode.UUID}-jump`,
            source: gustavNode.UUID,
            target: gustavNode.JumpTarget,
            type: "bezier",
            animated: true,
          },
        ]
      : []),
  ];
}

function useNodeDataState(dialogData: Gustav.DialogData) {
  const { displayJumpEdge, pinnedIdSet } = useWorkspace();

  // Node Data
  const rootNodes = useMemo(
    () => dialogData.RootNodes.map((id) => dialogData.Nodes[id]),
    [dialogData]
  );

  // Flowchart
  const nodesToRender = useMemo(
    () =>
      pinnedIdSet.size > 0
        ? getNodesPathThrough(dialogData.Nodes, [...pinnedIdSet])
        : Object.values(dialogData.Nodes),
    [dialogData.Nodes, pinnedIdSet]
  );
  const processedNodes: Node[] = useMemo(
    () =>
      nodesToRender.map((node) =>
        getNodeFromGustav(node, dialogData.Nodes, pinnedIdSet.has(node.UUID))
      ),
    [nodesToRender, dialogData.Nodes, pinnedIdSet]
  );
  const processedEdges: Edge[] = useMemo(
    () =>
      nodesToRender.flatMap((node) =>
        getEdgesFromGustav(node, displayJumpEdge)
      ),
    [nodesToRender, displayJumpEdge]
  );

  const getSpeakerName = useCallback(
    (speakerno: number) => {
      if (speakerno === -666) {
        return "Narrator";
      }

      const speaker = dialogData.SpeakerDict[speakerno];
      return (
        speaker?.SpeakerCharacter?.DisplayName ??
        speaker?.SpeakerGroupName ??
        "Unknown"
      );
    },
    [dialogData]
  );

  return {
    dialogData,
    rootNodes,
    processedNodes,
    processedEdges,
    getSpeakerName,
  };
}

const NodeDataStateContext = React.createContext<
  ReturnType<typeof useNodeDataState> | undefined
>(undefined);

function NodeDataProvider({ dialogData, children }: NodeDataProviderProps) {
  const value = useNodeDataState(dialogData);

  return (
    <NodeDataStateContext.Provider value={value}>
      {children}
    </NodeDataStateContext.Provider>
  );
}

function useNodeData() {
  const context = React.useContext(NodeDataStateContext);
  if (context === undefined) {
    throw new Error("useNodeData must be used within a NodeDataProvider");
  }
  return context;
}

export { NodeDataProvider, useNodeData };
