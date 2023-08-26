import { Button, HStack, Input, Select } from "@chakra-ui/react";
import React, { useState } from "react";
import { useReactFlow } from "reactflow";
import { useNodeData } from "./useNodeData";
import { useWorkspace } from "./useWorkspace";

const urlParams = new URLSearchParams(window.location.search);

function Navigator() {
  const { rootNodes } = useNodeData();
  const { rootId, setRootId } = useWorkspace();
  const { fitView } = useReactFlow();

  const [nodeSearchId, setNodeSearchId] = useState<string>("");

  // get query param from router to set initial nodeSearchId
  React.useEffect(() => {
    const nodeId = urlParams.get("node_id");
    if (nodeId !== null) {
      setNodeSearchId(nodeId);
      setTimeout(() => fitView({ nodes: [{ id: nodeId }] }), 0);
    }
  }, [fitView]);

  function searchNode() {
    setTimeout(() => fitView({ nodes: [{ id: nodeSearchId }] }), 0);
  }

  return (
    <HStack>
      <Select
        flex={1}
        value={rootId}
        onChange={(e) => setRootId(e.target.value)}
      >
        <option value={""}>Select a root node</option>
        {rootNodes.map((node) => (
          <option key={node.UUID} value={node.UUID}>
            {node.EditorData.logicalname} ({node.UUID})
          </option>
        ))}
      </Select>
      <HStack flex={1}>
        <Input
          value={nodeSearchId}
          onChange={(e) => setNodeSearchId(e.currentTarget.value)}
          placeholder="Node ID"
        />
        <Button onClick={searchNode}>Find</Button>
      </HStack>
    </HStack>
  );
}

export default Navigator;
