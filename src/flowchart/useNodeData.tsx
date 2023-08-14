import * as React from "react";
import { useMemo, useState } from "react";
import { Edge, Node, Position } from "reactflow";
import data from "../data/Astarion_InParty2.json";
import { NodeData, Speaker } from "../data/types";
import { getAllFlags, getNodesRecursive, parsePosition } from "../data/utils";

type NodeDataProviderProps = { children: React.ReactNode };

export const nodeDataRecord = data.Nodes as unknown as Record<string, NodeData>;
export const speakerRecord = data.SpeakerDict as Record<string, Speaker>;
const rootNodeIds = data.RootNodes as string[];
const nodeDataList = Object.values(nodeDataRecord);
const rootNodes = rootNodeIds
  .map((id) => nodeDataRecord[id])
  .filter((node) => node.TaggedTextList.length > 0);
const flags = getAllFlags(nodeDataList);

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

function useNodeDataState() {
  const [rootId, setRootId] = useState<string>();
  const [flagState, setFlagState] = useState<Record<string, boolean>>(
    Object.fromEntries(flags.map((flag) => [flag.UUID, false]))
  );

  const filteredData = useMemo(
    () => (rootId ? getNodesRecursive(nodeDataRecord, rootId) : nodeDataList),
    [rootId]
  );
  const processedNodes: Node[] = useMemo(
    () => filteredData.map((node) => getNodeFromData(node)),
    [filteredData]
  );
  const processedEdges: Edge[] = useMemo(
    () => filteredData.flatMap((node) => getEdgesFromData(node)),
    [filteredData]
  );

  function setAllFlags(value: boolean) {
    setFlagState((prev) =>
      Object.fromEntries(Object.keys(prev).map((key) => [key, value]))
    );
  }

  function setFlag(uuid: string, value: boolean) {
    setFlagState((prev) => ({ ...prev, [uuid]: value }));
  }

  return {
    rootNodes,
    flags,
    rootId,
    setRootId,
    flagState,
    setFlag,
    setAllFlags,
    processedNodes,
    processedEdges,
  };
}

const NodeDataStateContext = React.createContext<
  ReturnType<typeof useNodeDataState> | undefined
>(undefined);

function NodeDataProvider({ children }: NodeDataProviderProps) {
  const value = useNodeDataState();

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
