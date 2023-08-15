import * as React from "react";
import { DialogData } from "./types";

// const REMOTE_URL = "https://waldo.team/bg3_dialog/";
const REMOTE_URL = "http://localhost:8080/";

type DialogDataProviderProps = {
  children: React.ReactNode;
};

function useDialogDataState() {
  const [path, setPath] = React.useState<string>();
  const [dialogData, setDialogData] = React.useState<DialogData>();

  React.useEffect(() => {
    if (path !== undefined) {
      fetch(REMOTE_URL + path, {
        headers: {
          "Content-Type": "application/json",
        },
      })
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
