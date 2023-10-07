import { MouseEvent, useEffect, useRef, useState } from "react";
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
  }, []);

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

  useEffect(() => {
    window.electronApi.ReceiveFromElectron("music-deleted", () => {
      setMusicIndex((currentIndex) => {
        if (audioRef.current && currentIndex <= musicPlaylist.length - 1) {
          setMusic(`/musics/${musicPlaylist[currentIndex + 1]}`);
          audioRef.current.load();
          audioRef.current.play();
          setCurrentTime(audioRef.current.currentTime);
          setMusicPlaylist((currentPlaylist) =>
            currentPlaylist.filter(
              (music) => music !== currentPlaylist[currentIndex - 1]
            )
          );
          return currentIndex + 1;
        }

        setMusic(undefined);
        return currentIndex;
      });
    });
  }, [musicPlaylist]);

  function handleProgressbarClick(event: MouseEvent<HTMLProgressElement>) {
    if (audioRef.current) {
      const progressbar = event.currentTarget;

      const clickPosition = event.nativeEvent.offsetX;
      const progressbarTotalWidth = progressbar.clientWidth;
      const time =
        audioRef.current.duration * (clickPosition / progressbarTotalWidth);
      audioRef.current.currentTime = time;
      progressbar.value = (time / audioRef.current.duration) * 100;
    }
  }

  function handleNextMusic() {
    if (audioRef.current && musicIndex < musicPlaylist.length - 1) {
      setMusicIndex((currentIndex) => currentIndex + 1);
      setMusic(`/musics/${musicPlaylist[musicIndex + 1]}`);
      audioRef.current.load();
      audioRef.current.play();
      setCurrentTime(audioRef.current.currentTime);
    }
  }

  function handlePreviousMusic() {
    if (musicPlaylist.length === 0) return;

    if (audioRef.current && musicIndex > 0) {
      setMusicIndex((currentIndex) => currentIndex - 1);
      const previousMusic = musicPlaylist[musicIndex - 1];

      if (previousMusic) {
        setMusic(`/musics/${previousMusic}`);
        audioRef.current.load();
        audioRef.current.play();
        setCurrentTime(audioRef.current.currentTime);
      } else {
        console.error("A música anterior não existe mais.");
      }
    }
  }

  return (
    <div className="grow w-96 h-14 px-8 flex-col justify-center items-center gap-4 inline-flex">
      <div className="justify-center items-center gap-8 inline-flex">
        <button onClick={handlePreviousMusic}>
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

        <button onClick={handleNextMusic}>
          <NextIcon />
        </button>
      </div>

      <audio ref={audioRef} onEnded={handleNextMusic}>
        <source src={music} type="audio/mp3" />
      </audio>

      <div className="flex justify-center items-center gap-3">
        <p className="text-center text-sm text-white font-semibold tracking-wide">
          {timeFormatter(currentTime)}
        </p>

        <progress
          onClick={handleProgressbarClick}
          max={100}
          value={
            audioRef.current?.duration && audioRef.current.duration > 0
              ? (audioRef.current.currentTime / audioRef.current.duration) * 100
              : 0
          }
          className="[&::-webkit-progress-bar]:bg-zinc-700 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-blue-300 w-96  h-4 border-none"
        />

        <p className="text-center text-sm text-white font-semibold tracking-wide">
          {timeFormatter(duration)}
        </p>
      </div>
    </div>
  );
}
