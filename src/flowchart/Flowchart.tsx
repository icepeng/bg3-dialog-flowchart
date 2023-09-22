import { useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Panel,
  useReactFlow,
} from "reactflow";
import type * as Gustav from "@gustav/types";
import { useNodeData } from "./useNodeData";
import { useWorkspace } from "./useWorkspace";
import { nodeTypes } from "./custom-node";
import ConfigPanel from "./ConfigPanel";
import { useWeblate } from "@/weblate/useWeblate";
import { TranslationState } from "@/weblate/types";

function Flowchart() {
  const { rootId, togglePinnedId } = useWorkspace();
  const { processedNodes, processedEdges } = useNodeData();
  const { getNodeTranslationState } = useWeblate();
  const { fitView, setNodes, setEdges } = useReactFlow();

  useEffect(() => {
    if (!rootId) return;
    setTimeout(() => fitView({ nodes: [{ id: rootId }] }), 0);
  }, [rootId, fitView]);

  useEffect(() => {
    setNodes(processedNodes);
    setEdges(processedEdges);
  }, [processedNodes, processedEdges, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (e: React.MouseEvent, node: Node<Gustav.Node>) => {
      if (e.ctrlKey) {
        togglePinnedId(node.id);
        return;
      }
      if (node.data.Constructor === "Jump") {
        const targetId = node.data.JumpTarget!;
        fitView({ nodes: [{ id: targetId }], duration: 200 });
      }
    },
    [fitView, togglePinnedId]
  );

  const nodeColor = useCallback(
    (node: Node<Gustav.Node>) => {
      switch (getNodeTranslationState(node.data)) {
        case TranslationState.APPROVED:
          return 'blue';
        case TranslationState.TRANSLATED:
          return 'lightgreen';
        case TranslationState.FUZZY:
          return 'yellow';
        case TranslationState.EMPTY:
          return 'red';
        default: // node without texts
          return '#FFFFFF33';
      }
    }, [processedNodes, getNodeTranslationState]
  );

  return (
    <ReactFlow
      defaultNodes={processedNodes}
      defaultEdges={processedEdges}
      nodeTypes={nodeTypes}
      onNodeClick={onNodeClick}
      attributionPosition="bottom-left"
      minZoom={0.05}
    >
      <Background />
      <Controls />
      <MiniMap nodeColor={nodeColor} maskColor="#111111cc" nodeStrokeWidth={3} zoomable pannable />
      <Panel position="bottom-center">
        <ConfigPanel />
      </Panel>
    </ReactFlow>
  );
}

export default Flowchart;
