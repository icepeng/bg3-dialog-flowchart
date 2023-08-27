import React, { useState } from "react";

const VOICE_URL = "https://waldo.team/bg3_voice/";

const visuallyHiddenStyle = {
  border: "0",
  clip: "rect(0 0 0 0)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: "0",
  position: "absolute",
  width: "1px",
  whiteSpace: "nowrap",
  wordWrap: "normal",
} as const;

export function useAudio(handle: string): {
  isReady: boolean;
  audioProps: React.AudioHTMLAttributes<HTMLAudioElement>;
} {
  const [isReady, setIsReady] = useState(false);

  const src = `${VOICE_URL}${handle}.mp3`;

  function onLoadedData() {
    setIsReady(true);
  }

  return {
    isReady,
    audioProps: {
      src,
      onLoadedData,
      style: visuallyHiddenStyle,
    },
  };
}
