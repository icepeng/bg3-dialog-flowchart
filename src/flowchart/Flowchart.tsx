import { useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  useReactFlow,
} from "reactflow";
import { useNodeData } from "./useNodeData";
import AliasNode from "./AliasNode";
import DialogNode from "./DialogNode";
import JumpNode from "./JumpNode";
import { NodeData } from "../data/types";

const nodeTypes = {
  TagAnswer: DialogNode,
  Jump: JumpNode,
  TagQuestion: DialogNode,
  TagGreeting: DialogNode,
  "Nested Dialog": DialogNode,
  Alias: AliasNode,
  RollResult: DialogNode,
  Pop: DialogNode,
  ActiveRoll: DialogNode,
};

function Flowchart() {
  const { rootId, processedNodes, processedEdges } = useNodeData();
  const { fitView } = useReactFlow();

  useEffect(() => {
    if (!rootId) return;
    setTimeout(() => fitView({ nodes: [{ id: rootId }] }), 0);
  }, [rootId, fitView]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<NodeData>) => {
      if (node.data.Constructor === "Jump") {
        const targetId = node.data.Children[0];
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
