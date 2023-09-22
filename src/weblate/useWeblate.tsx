import * as React from "react";
import * as Gustav from "@gustav/types";
import { useGustav } from "@gustav/useGustav";
import { TranslationData, TranslationState, TranslationUnit } from "./types";
import { useCallback } from "react";
import { getAllTextHandles } from "@/gustav/utils";

const REMOTE_API_URL = "https://waldo.team/api/bg3_dialog";
const TRANSLATE_PAGE_URL = "https://waldo.team/translate/bg3";
const SEARCH_PAGE_URL = "https://waldo.team/search/bg3/";

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
        (item) => item.state >= TranslationState.TRANSLATED
      ).length;
      const fuzzy = Object.values(translationData).filter(
        (item) => item.state === TranslationState.FUZZY
      ).length;

      return {
        total,
        translated,
        fuzzy,
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

  const getTranslationState = useCallback(
    (handle: string) => translationData?.[handle]?.state,
    [translationData]
  );

  const getNodeTranslationState = useCallback(
    (node: Gustav.Node) => {
      const nodeTexts = getAllTextHandles(node);
      const translationStates = nodeTexts.map(getTranslationState)
        .filter((state) => state !== undefined) as number[];
      return Math.min(...translationStates);
    }, [translationData]
  );

  const getTranslateUnit = useCallback(
    (localizedString: Gustav.LocalizedString) => {
      if (!translationData) {
        return undefined;
      }

      const unit = translationData?.[localizedString.Handle];
      if (!unit) {
        console.warn("No translation unit found for", localizedString);
        return undefined;
      }

      return unit;
    },
    [translationData]
  );

  const getWeblateSearchUrl = useCallback(
    (... params: string[]) => {
      if (!translationData) {
        return undefined;
      }
      const locaition_query = `location:"${path.replace(".json", "")}:"`;
      const query_str = params.concat([locaition_query]).join(" AND ")
      return `${SEARCH_PAGE_URL}?q=${query_str}`;
    },
    [path, translationData]
  );

  return {
    translationData,
    apiToken,
    translationProgress,
    getTranslationState,
    getNodeTranslationState,
    setApiToken,
    getWeblateUrl,
    getTranslateUnit,
    loadTranslationData,
    getWeblateSearchUrl,
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
