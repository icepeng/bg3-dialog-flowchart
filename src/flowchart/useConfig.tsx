import * as React from "react";
import { useState } from "react";
import { useDialogData } from "../data/useDialogData";

type ConfigProviderProps = {
  children: React.ReactNode;
};

function useConfigState() {
  const { path } = useDialogData();

  const [rootId, setRootId] = useState<string>();
  const [flagRecord, setFlagRecord] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    setRootId(undefined);
    setFlagRecord({});
  }, [path]);

  function setAllFlags(value: boolean) {
    setFlagRecord((prev) =>
      Object.fromEntries(Object.keys(prev).map((key) => [key, value]))
    );
  }

  function setFlag(uuid: string, value: boolean) {
    setFlagRecord((prev) => ({ ...prev, [uuid]: value }));
  }

  return {
    rootId,
    setRootId,
    flagRecord,
    setFlagRecord,
    setFlag,
    setAllFlags,
  };
}

const ConfigStateContext = React.createContext<
  ReturnType<typeof useConfigState> | undefined
>(undefined);

function ConfigProvider({ children }: ConfigProviderProps) {
  const value = useConfigState();

  return (
    <ConfigStateContext.Provider value={value}>
      {children}
    </ConfigStateContext.Provider>
  );
}

function useConfig() {
  const context = React.useContext(ConfigStateContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
}

export { ConfigProvider, useConfig };
