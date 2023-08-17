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
  VisualState: DialogNode,
};

function Flowchart() {
  const { rootId } = useConfig();
  const { processedNodes, processedEdges } = useNodeData();
  const { fitView } = useReactFlow();

  useEffect(() => {
    if (!rootId) return;
    setTimeout(() => fitView({ nodes: [{ id: rootId }] }), 0);
  }, [rootId, fitView]);

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
      nodes={processedNodes}
      edges={processedEdges}
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
