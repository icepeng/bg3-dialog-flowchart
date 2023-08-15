import * as React from "react";
import { useMemo } from "react";
import { Edge, Node, Position } from "reactflow";
import { DialogData, NodeData } from "../data/types";
import { getAllFlags, getNodesRecursive, parsePosition } from "../data/utils";
import { useConfig } from "./useConfig";

type NodeDataProviderProps = {
  dialogData: DialogData;
  children: React.ReactNode;
};

function getNodeFromData(data: NodeData): Node {
  const { x, y } = parsePosition(data.EditorData.position);
  return {
    id: data.UUID,
    type: data.Constructor,
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
    data: data,
  };
}

function getEdgesFromData(data: NodeData): Edge[] {
  return data.Children.map((child) => {
    const edge: Edge = {
      id: `${data.UUID}-${child}`,
      source: data.UUID,
      target: child,
      type: "smoothstep",
    };
    return edge;
  });
}

function useNodeDataState(dialogData: DialogData) {
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

  // Flags
  const flags = React.useMemo(() => getAllFlags(nodeDataList), [nodeDataList]);

  // Flowchart
  const filteredData = useMemo(
    () => (rootId ? getNodesRecursive(dialogData.Nodes, rootId) : nodeDataList),
    [dialogData.Nodes, nodeDataList, rootId]
  );
  const processedNodes: Node[] = useMemo(
    () => filteredData.map((node) => getNodeFromData(node)),
    [filteredData]
  );
  const processedEdges: Edge[] = useMemo(
    () => filteredData.flatMap((node) => getEdgesFromData(node)),
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
    flags,
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
