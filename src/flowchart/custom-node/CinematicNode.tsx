import { CinematicNode } from "@gustav/types";
import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";

const CinematicNode = memo<NodeProps<CinematicNode>>(
  ({ data, isConnectable }) => {
    const category = data.Constructor;
    const context = data.EditorData.CinematicNodeContext!;

    return (
      <>
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
        />
        <div>[{category}]</div>
        <div>시네마틱: {context}</div>
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
        />
      </>
    );
  }
);

export default CinematicNode;
