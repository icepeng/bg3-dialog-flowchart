interface EditorData {
  ID: string;
  TemplateNodeUUID: string;
  TemplateVersion: string;
  collapsed: "True" | "False";
  logicalname: string;
  position: string;
  sourcetemplate: string;
  AnimationTags?: string;
  Attitude?: string;
  CinematicNodeContext?: string;
  CinematicObjects?: string;
  CustomCineArtKeysPresent?: "True" | "False";
  CustomLightingPresent?: "True" | "False";
  CustomSoundPresent?: "True" | "False";
  CustomVFXPresent?: "True" | "False";
  Emotion?: string;
  ForceDisableIsCustomNode?: "True" | "False";
  InternalNodeContext?: string;
  IsCustomNode?: "True" | "False";
  MusicTags?: string;
  NodeContext?: string;
  Quality?: string;
  SFXTags?: string;
  StateChangeTags?: string;
  VFXTags?: string;
  stateContext?: string;
}

export interface Rule {
  HasChildRules: boolean;
  TagCombineOp: 0 | 2;
  Tags: string[];
  TagNames: string[];
}

export interface RuleGroup {
  TagCombineOp: 0 | 2;
  Rules: Rule[];
}

export interface TagText {
  LineId: string;
  Text: {
    Handle: string;
    Value: string;
  };
}

export interface TaggedText {
  HasTagRule: boolean;
  RuleGroup: RuleGroup;
  TagTexts: TagText[];
}

export interface Flag {
  UUID: string;
  paramval: 0 | 1;
  value: boolean;
  Name: string;
}

export interface FlagGroup {
  Flags: Flag[];
  Type: "Global" | "Tag" | "Object" | "Dialog";
}

export interface BaseNode {
  SourceNode?: string;
  JumpTarget?: string;
  UUID: string;
  Constructor:
    | "TagAnswer"
    | "TagGreeting"
    | "TagQuestion"
    | "Jump"
    | "TagCinematic"
    | "Alias"
    | "RollResult"
    | "ActiveRoll"
    | "PassiveRoll"
    | "Visual State"
    | "Trade"
    | "Pop"
    | "FallibleQuestionResult"
    | "Nested Dialog";
  EndNode: boolean;
  Root: boolean;
  ShowOnce: boolean;
  SpeakerNo: -1 | 0 | 1;
  AddressedSpeaker: 0;
  Children: string[];
  CheckFlags: FlagGroup[];
  SetFlags: FlagGroup[];
  TaggedTextList: TaggedText[];
  EditorData: EditorData;
}

export interface JumpNode extends BaseNode {
  Constructor: "Jump";
  SourceNode: string;
  JumpTarget: string;
}

export interface RollNode extends BaseNode {
  Constructor: "PassiveRoll" | "ActiveRoll";
  RollAbility: string;
  RollAdvantage: number;
  RollType: "SkillCheck" | "RawAbility" | "";
}

export interface RollResultNode extends BaseNode {
  Constructor: "RollResult";
  RollSuccess: boolean;
}

export interface CinematicNode extends BaseNode {
  Constructor: "TagCinematic";
}

export interface VisualStateNode extends BaseNode {
  Constructor: "Visual State";
}

export type Node =
  | BaseNode
  | JumpNode
  | RollNode
  | RollResultNode
  | CinematicNode;

interface SpeakerCharacter {
  DisplayName: string;
  Type: "character";
  MapKey: string;
  Name: string;
  ParentTemplateId: string | null;
  TemplateName: string;
}

export interface Speaker {
  IsPeanutSpeaker: boolean;
  SpeakerMappingId: string;
  Index: number;
  List: string[];
  SpeakerCharacter: SpeakerCharacter;
  SpeakerGroupName: string | null;
}

export interface DialogData {
  Path: string;
  UUID: string;
  Category: string;
  RootNodes: string[];
  Nodes: Record<string, Node>;
  SpeakerDict: Record<string, Speaker>;
}
