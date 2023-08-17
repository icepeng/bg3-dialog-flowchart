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
}

interface Rule {
  HasChildRules: boolean;
  TagCombineOp: 0 | 2;
  Tags: string[];
  TagNames: string[];
}

interface RuleGroup {
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

interface Flag {
  UUID: string;
  paramval: 0 | 1;
  value: boolean;
  Name: string;
}

interface FlagGroup {
  Flags: Flag[];
  Type: "Global" | "Tag" | "Object" | "Dialog";
}

export interface BaseNodeData {
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
    | "VisualState"
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

export interface JumpNodeData extends BaseNodeData {
  Constructor: "Jump";
  SourceNode: string;
  JumpTarget: string;
}

export interface RollNodeData extends BaseNodeData {
  Constructor: "PassiveRoll" | "ActiveRoll";
  RollAbility: string;
  RollAdvantage: number;
  RollType: "SkillCheck" | "RawAbility";
}

export interface RollResultNodeData extends BaseNodeData {
  Constructor: "RollResult";
  RollSuccess: boolean;
}

export interface CinematicNodeData extends BaseNodeData {
  Constructor: "TagCinematic";
}

export type NodeData =
  | BaseNodeData
  | JumpNodeData
  | RollNodeData
  | RollResultNodeData
  | CinematicNodeData;

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
  Nodes: Record<string, NodeData>;
  SpeakerDict: Record<string, Speaker>;
}

export interface TranslationUnit {
  id: number;
  position: number;
  context: string;
  source: string;
  target: string;
  fuzzy: boolean;
  approved: boolean;
  component: string;
}

export type TranslationData = {
  [context: string]: TranslationUnit;
};
