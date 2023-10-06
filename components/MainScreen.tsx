import ImportFiles from "./ImportFiles";
import MusicList from "./MusicList";

export default function MainScreen() {
  return (
    <div className="grow flex">
      <aside className="w-4/12 bg-zinc-800 p-10">
        <ImportFiles />
      </aside>
      <main className="flex mt-10 w-full justify-center">
        <MusicList />
      </main>
    </div>
  );
}
