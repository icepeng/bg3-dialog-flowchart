import * as React from "react";
import { useState } from "react";
import { useGustav } from "@gustav/useGustav";

type WorkspaceProviderProps = {
  children: React.ReactNode;
};

function useWorkspaceState() {
  const { path } = useGustav();

  const [rootId, setRootId] = useState<string>();
  const [selectedId, setSelectedId] = useState<string>();

  React.useEffect(() => {
    setRootId(undefined);
  }, [path]);

  return {
    rootId,
    setRootId,
    selectedId,
    setSelectedId,
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
