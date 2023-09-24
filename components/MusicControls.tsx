import { useRef, useState } from "react";
import NextIcon from "./icons/NextIcon";
import PauseIcon from "./icons/PauseIcon";
import PlayIcon from "./icons/PlayIcon";
import PreviousIcon from "./icons/PreviousIcon";

export default function MusicControls() {
  const [musicPlaylist, setMusicPlaylist] = useState([]);
  const [music, setMusic] = useState(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [musicIndex, setMusicIndex] = useState(0);

  return (
    <div className="grow w-96 h-14 px-8 flex-col justify-center items-center gap-4 inline-flex">
      <div className="justify-center items-center gap-8 inline-flex">
        <button>
          <PreviousIcon />
        </button>

        <button>
          <PlayIcon />
        </button>

        <button>
          <NextIcon />
        </button>
      </div>

      <audio>
        <source type="audio/mp3" />
      </audio>

      <div className="flex justify-center items-center gap-3">
        <p className="text-center text-sm text-white font-semibold tracking-wide">
          00:00
        </p>

        <progress
          max={100}
          value={25}
          className="[&::-webkit-progress-bar]:bg-zinc-700 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-blue-300 w-96  h-4 border-none"
        />

        <p className="text-center text-sm text-white font-semibold tracking-wide">
          00:00
        </p>
      </div>
    </div>
  );
}
