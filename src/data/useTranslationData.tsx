import * as React from "react";
import { TagText, TranslationData, TranslationUnit } from "./types";
import { useDialogData } from "./useDialogData";

const REMOTE_API_URL = "https://waldo.team/api/bg3_dialog";
const TRANSLATE_PAGE_URL = "https://waldo.team/translate/bg3";

type TranslationDataProviderProps = {
  children: React.ReactNode;
};

const convertToTranslationData = (
  jsonData: Array<TranslationUnit>
): TranslationData => {
  const translationData: TranslationData = {};

  jsonData.forEach((item) => {
    translationData[item.context] = item;
  });

  return translationData;
};

function useTranslationDataState() {
  const { path } = useDialogData();

  const [apiToken, setApiToken] = React.useState<string>(
    localStorage.getItem("apiToken") || ""
  );
  const [translationData, setTranslationData] =
    React.useState<TranslationData>();

  React.useEffect(() => {
    if (path !== undefined && apiToken) {
      fetch(REMOTE_API_URL, {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: "Token " + apiToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dialog: path }),
      })
        .then((response) => response.json())
        .then((data: Array<TranslationUnit>) => convertToTranslationData(data))
        .then((data: TranslationData) => setTranslationData(data));
    }
  }, [path, apiToken]);

  React.useEffect(() => {
    localStorage.setItem("apiToken", apiToken);
  }, [apiToken]);

  function getWeblateUrl(tagText: TagText) {
    const unit = translationData?.[tagText.Text.Handle];
    if (unit) {
      return `${TRANSLATE_PAGE_URL}/${unit.component}/ko/?offset=${unit.position}`;
    }
    return undefined;
  }

  function getTranslatedText(tagText: TagText) {
    const unit = translationData?.[tagText.Text.Handle];
    if (unit) {
      return unit.target;
    }
    return undefined;
  }

  return {
    translationData,
    apiToken,
    setApiToken,
    getWeblateUrl,
    getTranslatedText,
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
    throw new Error(
      "useTranslationData must be used within a TranslationDataProvider"
    );
  }
  return context;
}

export { TranslationDataProvider, useTranslationData };
