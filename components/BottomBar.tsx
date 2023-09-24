import { useState } from "react";
import MusicControls from "./MusicControls";
import PlaylistIcon from "./icons/PlaylistIcon";
import Playlists from "./Playlists";

export default function BottomBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="absolute z-10 h-28 bottom-0 w-full flex items-center justify-evenly bg-zinc-800 p-6">
        <MusicControls />
        <button onClick={() => setIsOpen((isOpen) => !isOpen)}>
          <PlaylistIcon />
        </button>
      </nav>
      <Playlists isOpen={isOpen} />
    </>
  );
}
