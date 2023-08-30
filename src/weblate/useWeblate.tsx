import * as React from "react";
import * as Gustav from "@gustav/types";
import { useGustav } from "@gustav/useGustav";
import { TranslationData, TranslationUnit } from "./types";
import { useCallback } from "react";

const REMOTE_API_URL = "https://waldo.team/api/bg3_dialog";
const TRANSLATE_PAGE_URL = "https://waldo.team/translate/bg3";

async function fetchTranslation(
  path: string,
  apiToken: string
): Promise<Array<TranslationUnit>> {
  return fetch(REMOTE_API_URL, {
    method: "POST",
    mode: "cors",
    headers: {
      Authorization: "Token " + apiToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ dialog: path }),
  }).then((response) => response.json());
}

type WeblateProviderProps = {
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

function useWeblateState() {
  const { path } = useGustav();

  const [apiToken, setApiToken] = React.useState<string>(
    localStorage.getItem("apiToken") || ""
  );
  const [translationData, setTranslationData] =
    React.useState<TranslationData>();

  const translationProgress = React.useMemo(() => {
    if (translationData) {
      const total = Object.keys(translationData).length;
      const translated = Object.values(translationData).filter(
        (item) => item.target !== ""
      ).length;

      return {
        total,
        translated,
      };
    }
    return undefined;
  }, [translationData]);

  const loadTranslationData = React.useCallback(() => {
    if (path !== undefined && apiToken) {
      fetchTranslation(path, apiToken)
        .then((data) => convertToTranslationData(data))
        .then((data) => setTranslationData(data));
    }
  }, [path, apiToken]);

  React.useEffect(() => {
    loadTranslationData();
  }, [loadTranslationData]);

  React.useEffect(() => {
    localStorage.setItem("apiToken", apiToken);
  }, [apiToken]);

  function getWeblateUrl(tagText: Gustav.LocalizedString) {
    const unit = translationData?.[tagText.Handle];
    if (unit) {
      return `${TRANSLATE_PAGE_URL}/${unit.component}/ko/?checksum=${unit.checksum}`;
    }
    return undefined;
  }

  const getTranslatedText = useCallback(
    (localizedString: Gustav.LocalizedString) => {
      if (!translationData) {
        return undefined;
      }

      const unit = translationData?.[localizedString.Handle];
      if (!unit) {
        console.warn("No translation unit found for", localizedString);
        return "";
      }

      return unit.target;
    },
    [translationData]
  );

  const checkNodeTranslated = useCallback(
    (node: Gustav.Node) => {
      if (!translationData) {
        return true;
      }

      const rollAdvantageReason =
        "RollAdvantageReason" in node ? node.RollAdvantageReason : null;
      const tagTextStrings = node.TaggedTextList.flatMap((taggedText) =>
        taggedText.TagTexts.map((x) => x.Text)
      );
      const localizedStrings = [
        ...tagTextStrings,
        ...(rollAdvantageReason ? [rollAdvantageReason] : []),
      ];

      return !localizedStrings.map(getTranslatedText).includes("");
    },
    [translationData, getTranslatedText]
  );

  return {
    translationData,
    apiToken,
    translationProgress,
    setApiToken,
    getWeblateUrl,
    getTranslatedText,
    checkNodeTranslated,
    loadTranslationData,
  };
}

const WeblateStateContext = React.createContext<
  ReturnType<typeof useWeblateState> | undefined
>(undefined);

function WeblateProvider({ children }: WeblateProviderProps) {
  const value = useWeblateState();

  return (
    <WeblateStateContext.Provider value={value}>
      {children}
    </WeblateStateContext.Provider>
  );
}

function useWeblate() {
  const context = React.useContext(WeblateStateContext);
  if (context === undefined) {
    throw new Error("useWeblate must be used within a WeblateProvider");
  }
  return context;
}

export { WeblateProvider, useWeblate };
