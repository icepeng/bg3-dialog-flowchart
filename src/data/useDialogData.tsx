import * as React from "react";
import { DialogData } from "./types";

const REMOTE_URL = "https://waldo.team/bg3_dialog/";
// const REMOTE_URL = "http://localhost:8080/";
const DEFAULT_PATH =
  "Mods/Gustav/Story/Dialogs/Act1/Chapel/CHA_Crypt_Jergal.json";

type DialogDataProviderProps = {
  children: React.ReactNode;
};

const urlParams = new URLSearchParams(window.location.search);

function useDialogDataState() {
  const [path, setPath] = React.useState<string>(
    urlParams.get("path") ?? DEFAULT_PATH
  );
  const [dialogData, setDialogData] = React.useState<DialogData>();

  React.useEffect(() => {
    if (path !== undefined) {
      fetch(REMOTE_URL + path)
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

const DialogDataStateContext = React.createContext<
  ReturnType<typeof useDialogDataState> | undefined
>(undefined);

function DialogDataProvider({ children }: DialogDataProviderProps) {
  const value = useDialogDataState();

  return (
    <DialogDataStateContext.Provider value={value}>
      {children}
    </DialogDataStateContext.Provider>
  );
}

function useDialogData() {
  const context = React.useContext(DialogDataStateContext);
  if (context === undefined) {
    throw new Error("useDialogData must be used within a DialogDataProvider");
  }
  return context;
}

export { DialogDataProvider, useDialogData };
