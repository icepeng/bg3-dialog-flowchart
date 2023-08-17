import * as React from "react";
import { useState } from "react";
import { useGustav } from "../gustav/useGustav";

type ConfigProviderProps = {
  children: React.ReactNode;
};

function useConfigState() {
  const { path } = useGustav();

  const [rootId, setRootId] = useState<string>();

  React.useEffect(() => {
    setRootId(undefined);
  }, [path]);

  return {
    rootId,
    setRootId,
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
