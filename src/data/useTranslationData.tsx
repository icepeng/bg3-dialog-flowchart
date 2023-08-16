import * as React from "react";
import { TranslationData, TranslationUnit } from "./types";
import { useDialogData } from "./useDialogData";

const REMOTE_API_URL = "https://waldo.team/api/bg3_dialog";

type TranslationDataProviderProps = {
  children: React.ReactNode;
};

const API_TOKEN: string = "";

const convertToTranslationData = (jsonData: Array<TranslationUnit>): TranslationData => {
  const translationData: TranslationData = { };

  jsonData.forEach((item) => {
      translationData[item.context] = item;
  });

  return translationData;
};

function useTranslationDataState() {
  const { path } = useDialogData();

  const [translationData, setTranslationData] = React.useState<TranslationData>();

  React.useEffect(() => {
    if (path !== undefined && API_TOKEN) {
      fetch(REMOTE_API_URL, {
        method: "POST", 
        mode: "cors", 
        headers: { 
          "Authorization": "Token " + API_TOKEN,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({dialog: path})
      }).then((response) => response.json())
        .then((data: Array<TranslationUnit>) => convertToTranslationData(data))
        .then((data: TranslationData) => setTranslationData(data));
    }
  }, [path]);

  return {
    translationData,
  };
}

const TranslationDataStateContext = React.createContext<
  ReturnType<typeof useTranslationDataState> | undefined
>(undefined);

function TranslationDataProvider({ children }: TranslationDataProviderProps) {
  const value = useTranslationDataState();

  return (
    <TranslationDataStateContext.Provider value={value}>
      {children}
    </TranslationDataStateContext.Provider>
  );
}

function useTranslationData() {
  const context = React.useContext(TranslationDataStateContext);
  if (context === undefined) {
    throw new Error("useTranslationData must be used within a TranslationDataProvider");
  }
  return context;
}

export { TranslationDataProvider, useTranslationData };
