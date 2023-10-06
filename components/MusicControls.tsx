import { useEffect, useRef, useState } from "react";
import NextIcon from "./icons/NextIcon";
import PauseIcon from "./icons/PauseIcon";
import PlayIcon from "./icons/PlayIcon";
import PreviousIcon from "./icons/PreviousIcon";
import { timeFormatter } from "@/common/utils/timeFormatter";

export default function MusicControls() {
  const [musicPlaylist, setMusicPlaylist] = useState<string[]>([]);
  const [music, setMusic] = useState<string | undefined>(undefined);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [musicIndex, setMusicIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    window.electronApi.ReceiveFromElectron(
      "music-playable",
      (_event, music) => {
        setMusicPlaylist((currentMusicPlaylist) => [
          ...currentMusicPlaylist,
          music,
        ]);
        if (audioRef.current && !audioRef.current.currentSrc) {
          setMusic(`/musics/${music}`);
          audioRef.current.load();
          setCurrentTime(audioRef.current.currentTime);
        }
      }
    );
  }, [musicPlaylist]);

  useEffect(() => {
    const handleMusicLoaded = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("loadedmetadata", handleMusicLoaded);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener(
          "loadedmetadata",
          handleMusicLoaded
        );
      }
    };
  }, []);

  useEffect(() => {
    let interval: number;

    if (audioRef.current) {
      interval = setInterval(() => {
        if (audioRef.current) {
          if (!audioRef.current.paused) {
            const time = audioRef.current.currentTime;
            setCurrentTime(time);
          }
        }
      }, 1000) as unknown as number;
    }
    return () => {
      clearInterval(interval);
    };
  }, []);

  function handlePlayMusic() {
    if (music != null) {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  }

  function handlePauseMusic() {
    if (music != null) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  }

  return (
    <div className="grow w-96 h-14 px-8 flex-col justify-center items-center gap-4 inline-flex">
      <div className="justify-center items-center gap-8 inline-flex">
        <button>
          <PreviousIcon />
        </button>

        {isPlaying ? (
          <button onClick={handlePauseMusic}>
            <PauseIcon />
          </button>
        ) : (
          <button onClick={handlePlayMusic}>
            <PlayIcon />
          </button>
        )}

        <button>
          <NextIcon />
        </button>
      </div>

      <audio ref={audioRef}>
        <source src={music} type="audio/mp3" />
      </audio>

      <div className="flex justify-center items-center gap-3">
        <p className="text-center text-sm text-white font-semibold tracking-wide">
          {timeFormatter(currentTime)}
        </p>

        <progress
          max={100}
          value={duration > 0 ? (currentTime / duration) * 100 : 0}
          className="[&::-webkit-progress-bar]:bg-zinc-700 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-blue-300 w-96  h-4 border-none"
        />

        <p className="text-center text-sm text-white font-semibold tracking-wide">
          {timeFormatter(duration)}
        </p>
      </div>
    </div>
  );
}
