import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { NestedDialogNode } from "@gustav/types";
import dialogIds from "@/gustav/dialog_ids.json";

const NestedDialogNode = memo<NodeProps<NestedDialogNode>>(({ data, isConnectable }) => {
  const category = data.Constructor;

  // e.g. Mods/Gustav/Story/Dialogs/Act1/Goblin/GOB_GoblinPriest_ChainedCharacter.json
  const dialogPath = (dialogIds as Record<string, string>)[data.NestedDialogNodeUUID] ?? "Unknown";
  // get text after /Dialogs/ and remove extension
  const dialogName = dialogPath.split("/").slice(4).join("/").replace(/\.[^\.]*$/, "");

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <div>[{category}]</div>
      <div>{dialogName}</div>
      <div>[클릭해서 해당 대화문으로 이동]</div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </>
  );
});

export default NestedDialogNode;
