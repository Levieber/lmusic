import { useState } from "react";
import MusicItem from "./MusicItem";

export default function MenuList() {
  const [musicList, setMusicList] = useState<string[]>([]);

  return (
    <section className="w-11/12">
      <h2 className="ml-5 text-2xl">Lista de Músicas</h2>
      <ul>
        {musicList.length > 0 ? (
          musicList.map((music) => (
            <li key={music}>
              <MusicItem music={music} />
            </li>
          ))
        ) : (
          <li className="text-zinc-400">Lista vazia</li>
        )}
      </ul>
    </section>
  );
}
