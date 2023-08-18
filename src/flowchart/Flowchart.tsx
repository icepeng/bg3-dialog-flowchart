import { useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  NodeProps,
  useReactFlow,
} from "reactflow";
import type * as Gustav from "../gustav/types";
import CinematicNode from "./CinematicNode";
import DialogNode from "./DialogNode";
import JumpNode from "./JumpNode";
import RollNode from "./RollNode";
import RollResultNode from "./RollResultNode";
import VisualStateNode from "./VisualStateNode";
import { useConfig } from "./useConfig";
import { useNodeData } from "./useNodeData";

const nodeTypes: Record<
  Gustav.Node["Constructor"],
  React.NamedExoticComponent<NodeProps>
> = {
  Jump: JumpNode,
  Alias: DialogNode,
  TagAnswer: DialogNode,
  TagQuestion: DialogNode,
  TagGreeting: DialogNode,
  "Nested Dialog": DialogNode,
  RollResult: RollResultNode,
  Pop: DialogNode,
  ActiveRoll: RollNode,
  FallibleQuestionResult: DialogNode,
  PassiveRoll: RollNode,
  TagCinematic: CinematicNode,
  Trade: DialogNode,
  "Visual State": VisualStateNode,
};

function Flowchart() {
  const { rootId } = useConfig();
  const { processedNodes, processedEdges } = useNodeData();
  const { fitView, setNodes, setEdges } = useReactFlow();

  useEffect(() => {
    if (!rootId) return;
    setNodes(processedNodes);
    setEdges(processedEdges);
    setTimeout(() => fitView({ nodes: [{ id: rootId }] }), 0);
  }, [rootId, processedNodes, processedEdges, setNodes, setEdges, fitView]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<Gustav.Node>) => {
      if (node.data.Constructor === "Jump") {
        const targetId = node.data.JumpTarget!;
        fitView({ nodes: [{ id: targetId }] });
      }
    },
    [fitView]
  );

  return (
    <ReactFlow
      defaultNodes={processedNodes}
      defaultEdges={processedEdges}
      nodeTypes={nodeTypes}
      onNodeClick={onNodeClick}
      attributionPosition="bottom-left"
    >
      <Background />
      <Controls />
      <MiniMap nodeColor="#6ede87" nodeStrokeWidth={3} zoomable pannable />
    </ReactFlow>
  );
}

export default Flowchart;
