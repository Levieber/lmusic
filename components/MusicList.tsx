import { useEffect, useState } from "react";
import MusicItem from "./MusicItem";
import { toast } from "react-toastify";

export default function MenuList() {
  const [musicList, setMusicList] = useState<string[]>([]);

  function fetchMusics() {
    try {
      window.electronApi.SendToElectron("music-get");
      window.electronApi.ReceiveFromElectron("music-list", (_event, list) => {
        if (Array.isArray(list)) {
          setMusicList(list);
        }
      });
    } catch (error) {
      toast.error("Erro ao obter as músicas");
    }
  }

  useEffect(() => {
    fetchMusics();
  }, []);

  return (
    <section className="w-11/12 ml-5  h-[calc(100vh_-_10.5rem)] overflow-y-auto p-2">
      <h2 className="text-2xl">Lista de Músicas</h2>
      {musicList.length > 0 ? (
        <ul className="mt-5 flex flex-col gap-5">
          {musicList.map((music) => (
            <li key={music}>
              <MusicItem music={music} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-zinc-400">Lista vazia</p>
      )}
    </section>
  );
}
