import * as React from "react";
import { useMemo } from "react";
import { Edge, Node, Position } from "reactflow";
import type * as Gustav from "../gustav/types";
import { getNodesRecursive, parsePosition } from "../gustav/utils";
import { useConfig } from "./useConfig";

type NodeDataProviderProps = {
  dialogData: Gustav.DialogData;
  children: React.ReactNode;
};

function getNodeFromGustav(
  gustavNode: Gustav.Node,
  gustavNodes: Gustav.DialogData["Nodes"]
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
    type: gustavNode.Constructor,
    position: {
      x: Number(x),
      y: Number(y),
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    className: "react-flow__node-default",
    style: {
      width: "240px",
    },
    data,
  };
}

function getEdgesFromGustav(gustavNode: Gustav.Node): Edge[] {
  return gustavNode.Children.map((child) => {
    const edge: Edge = {
      id: `${gustavNode.UUID}-${child}`,
      source: gustavNode.UUID,
      target: child,
      type: "smoothstep",
    };
    return edge;
  });
}

function useNodeDataState(dialogData: Gustav.DialogData) {
  const { rootId } = useConfig();

  // Node Data
  const nodeDataList = React.useMemo(
    () => Object.values(dialogData.Nodes),
    [dialogData]
  );
  const rootNodes = React.useMemo(
    () => dialogData.RootNodes.map((id) => dialogData.Nodes[id]),
    [dialogData]
  );

  // Flowchart
  const filteredData = useMemo(
    () => (rootId ? getNodesRecursive(dialogData.Nodes, rootId) : nodeDataList),
    [dialogData.Nodes, nodeDataList, rootId]
  );
  const processedNodes: Node[] = useMemo(
    () => filteredData.map((node) => getNodeFromGustav(node, dialogData.Nodes)),
    [filteredData, dialogData.Nodes]
  );
  const processedEdges: Edge[] = useMemo(
    () => filteredData.flatMap((node) => getEdgesFromGustav(node)),
    [filteredData]
  );

  function getSpeakerName(speakerno: number) {
    if (speakerno === -666) {
      return "Narrator";
    }

    const speaker = dialogData.SpeakerDict[speakerno];
    return (
      speaker?.SpeakerCharacter?.DisplayName ??
      speaker?.SpeakerGroupName ??
      "Unknown"
    );
  }

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
