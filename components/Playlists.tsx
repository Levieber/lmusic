import { useEffect, useState } from "react";

export default function Playlists({ isOpen }: { isOpen: boolean }) {
  const [musicPlaylist, setMusicPlaylist] = useState<string[]>([]);

  useEffect(() => {
    window.electronApi.ReceiveFromElectron(
      "music-playable",
      (_event, music) => {
        setMusicPlaylist((playlist) => [...playlist, music]);
      }
    );

    window.electronApi.ReceiveFromElectron(
      "music-deleted",
      (_event, deletedMusic) => {
        setMusicPlaylist((playlist) =>
          playlist.filter((music) => music !== deletedMusic)
        );
      }
    );
  }, []);

  return (
    <aside
      style={{ transform: isOpen ? "translateX(0%)" : "translateX(100%)" }}
      className="absolute right-0 w-96 h-[calc(100vh_-_7rem)] transition-transform flex flex-col items-center bg-zinc-800 overflow-y-auto"
    >
      <h2 className="p-10 text-3xl font-bold">Playlist:</h2>
      {musicPlaylist.length === 0 ? (
        <p className="text-xl text-zinc-400">Vazio</p>
      ) : (
        <ul className="list-disc">
          {musicPlaylist.map((music, index) => (
            <li className="text-lg" key={`${music}-${index}`}>
              {music}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
