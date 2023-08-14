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

interface TagText {
  LineId: string;
  Text: {
    Handle: string;
    Value: string;
  };
}

interface TaggedText {
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

interface CheckOrSetFlag {
  Flags: Flag[];
  Type: "Global" | "Tag" | "Object" | "Dialog";
}

export interface NodeData {
  SourceNode?: string;
  UUID: string;
  Constructor:
    | "TagAnswer"
    | "Jump"
    | "TagQuestion"
    | "TagGreeting"
    | "Nested Dialog"
    | "Alias"
    | "RollResult"
    | "Pop"
    | "ActiveRoll";
  EndNode: boolean;
  Root: boolean;
  ShowOnce: boolean;
  SpeakerNo: -1 | 0 | 1;
  AddressedSpeaker: 0;
  Children: string[];
  CheckFlags: CheckOrSetFlag[];
  SetFlags: CheckOrSetFlag[];
  TaggedTextList: TaggedText[];
  EditorData: EditorData;
}

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
