import { useEffect, useState } from "react";

const VOICE_URL = "https://waldo.team/bg3_voice/";

async function createAudio(src: string) {
  return new Promise<Howl | undefined>((resolve) => {
    const audio = new Howl({
      src,
    });
    audio.once("load", () => {
      resolve(audio);
    });
    audio.once("loaderror", () => {
      resolve(undefined);
    });
  });
}

export function useAudio(handle: string) {
  const [audio, setAudio] = useState<Howl | undefined>();

  useEffect(() => {
    createAudio(`${VOICE_URL}${handle}.mp3`).then(setAudio);
  }, [handle]);

  function playAudio() {
    if (!audio) {
      return;
    }
    audio.play();
  }

  return {
    isAudioAvailable: !!audio,
    playAudio,
  };
}
