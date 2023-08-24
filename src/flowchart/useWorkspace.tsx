import * as Gustav from "@gustav/types";
import { useGustav } from "@gustav/useGustav";
import { Howl } from "howler";
import * as React from "react";
import { useState } from "react";
import { useOnSelectionChange, useReactFlow } from "reactflow";

type WorkspaceProviderProps = {
  children: React.ReactNode;
};

function getFirstTextHandle(node: Gustav.Node) {
  return node.TaggedTextList[0]?.TagTexts[0]?.Text?.Handle ?? "";
}

function useWorkspaceState() {
  const { path, dialogData } = useGustav();

  const [rootId, setRootId] = useState<string>();
  const [selectedData, setSelectedData] = useState<Gustav.Node>();
  const [highlightUntranslated, setHighlightUntranslated] =
    useState<boolean>(false);

  const { fitView } = useReactFlow();
  useOnSelectionChange({
    onChange(selection) {
      setSelectedData(selection.nodes[0]?.data);
    },
  });

  React.useEffect(() => {
    setRootId(undefined);
  }, [path]);

  async function playAudio(src: string) {
    return new Promise<void>((resolve, reject) => {
      const audio = new Howl({
        src,
      });
      audio.play();
      audio.once("end", () => {
        resolve();
      });
      audio.once("loaderror", () => {
        reject();
      });
    });
  }

  async function play() {
    if (!selectedData) return;

    let data = selectedData;
    while (true) {
      const handle = getFirstTextHandle(data);
      if (handle) {
        await playAudio(`https://waldo.team/bg3_voice/${handle}.mp3`).catch(
          () => {}
        );
      }
      if (data.EndNode) return;

      data = dialogData!.Nodes[data.Children[0]];
      fitView({ nodes: [{ id: data.UUID }], duration: 200 });
    }
  }

  return {
    rootId,
    setRootId,
    selectedData,
    highlightUntranslated,
    setHighlightUntranslated,
    play,
  };
}

const WorkspaceStateContext = React.createContext<
  ReturnType<typeof useWorkspaceState> | undefined
>(undefined);

function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const value = useWorkspaceState();

  return (
    <WorkspaceStateContext.Provider value={value}>
      {children}
    </WorkspaceStateContext.Provider>
  );
}

function useWorkspace() {
  const context = React.useContext(WorkspaceStateContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}

export { WorkspaceProvider, useWorkspace };
