import AddIcon from "./icons/AddIcon";
import DeleteIcon from "./icons/DeleteIcon";
import EmptyAlbumIcon from "./icons/EmptyAlbumIcon";

type MusicItemProps = {
  music: string;
};

export default function MusicItem({ music }: MusicItemProps) {
  function handleDeleteMusic(music: string) {
    window.electronApi.SendToElectron("music-delete", music);
  }

  function handleAddMusic(music: string) {
    window.electronApi.SendToElectron("music-to-play", music);
  }

  return (
    <article className="p-2 flex flex-row border border-gray-500 w-full gap-2">
      <EmptyAlbumIcon />
      <section className="flex justify-between w-full">
        <h3 className="text-lg font-bold">{music}</h3>
        <div className="flex flex-row justify-center gap-5 h-full">
          <button type="button" onClick={() => handleAddMusic(music)}>
            <AddIcon />
          </button>
          <button type="button" onClick={() => handleDeleteMusic(music)}>
            <DeleteIcon />
          </button>
        </div>
      </section>
    </article>
  );
}
