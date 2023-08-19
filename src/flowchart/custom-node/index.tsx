import type * as Gustav from "@gustav/types";
import { NodeProps } from "reactflow";
import AliasNode from "./AliasNode";
import CinematicNode from "./CinematicNode";
import DialogNode from "./DialogNode";
import JumpNode from "./JumpNode";
import RollNode from "./RollNode";
import RollResultNode from "./RollResultNode";
import VisualStateNode from "./VisualStateNode";

export const nodeTypes: Record<
  Gustav.Node["Constructor"],
  React.NamedExoticComponent<NodeProps>
> = {
  Jump: JumpNode,
  Alias: AliasNode,
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
