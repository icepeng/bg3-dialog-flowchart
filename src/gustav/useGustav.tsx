import * as React from "react";
import { DialogData } from "./types";

const DIALOG_URL = "https://waldo.team/bg3/dialog/";
// const DIALOG_URL = "http://localhost:8080/";
const DEFAULT_PATH =
  "Mods/Gustav/Story/Dialogs/Act1/Chapel/CHA_Crypt_Jergal.json";

type GustavProviderProps = {
  children: React.ReactNode;
};

const urlParams = new URLSearchParams(window.location.search);

function normalizePath(path: string) {
  return path.replace(/\\/g, "/").replace(/(\.\w+)+$/, "");
}

function useGustavState() {
  const [path, setPathInternal] = React.useState<string>(
    normalizePath(urlParams.get("path") ?? DEFAULT_PATH)
  );
  const [dialogData, setDialogData] = React.useState<DialogData>();

  const setPath = (newPath: string) => setPathInternal(normalizePath(newPath));

  React.useEffect(() => {
    if (path !== undefined) {
      fetch(DIALOG_URL + path + ".json")
        .then((response) => response.json())
        .then((data) => setDialogData(data));
    }
  }, [path]);

  return {
    dialogData,
    path,
    setPath,
  };
}

const GustavStateContext = React.createContext<
  ReturnType<typeof useGustavState> | undefined
>(undefined);

function GustavProvider({ children }: GustavProviderProps) {
  const value = useGustavState();

  return (
    <GustavStateContext.Provider value={value}>
      {children}
    </GustavStateContext.Provider>
  );
}

function useGustav() {
  const context = React.useContext(GustavStateContext);
  if (context === undefined) {
    throw new Error("useGustav must be used within a GustavProvider");
  }
  return context;
}

export { GustavProvider, useGustav };
