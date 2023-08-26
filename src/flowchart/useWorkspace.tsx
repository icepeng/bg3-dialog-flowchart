import * as React from "react";
import { useCallback, useState } from "react";
import { useGustav } from "@gustav/useGustav";

type WorkspaceProviderProps = {
  children: React.ReactNode;
};

function useWorkspaceState() {
  const { path } = useGustav();

  const [rootId, setRootId] = useState<string>();
  const [pinnedIdSet, setPinnedIdSet] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string>();
  const [highlightUntranslated, setHighlightUntranslated] =
    useState<boolean>(false);
  const [displayJumpEdge, setDisplayJumpEdge] = useState<boolean>(false);

  React.useEffect(() => {
    setRootId(undefined);
  }, [path]);

  const togglePinnedId = useCallback(
    (id: string) => {
      setPinnedIdSet((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    },
    [setPinnedIdSet]
  );

  return {
    rootId,
    setRootId,
    pinnedIdSet,
    setPinnedIdSet,
    togglePinnedId,
    selectedId,
    setSelectedId,
    highlightUntranslated,
    setHighlightUntranslated,
    displayJumpEdge,
    setDisplayJumpEdge,
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
