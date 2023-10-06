import { ChangeEvent } from "react";

export default function ImportFiles() {
  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      selectedFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onload = () => {
          const fileData = reader.result;
          if (fileData instanceof ArrayBuffer) {
            const fileObject = {
              name: file.name,
              data: new Uint8Array(fileData),
            };
            window.electronApi.SendToElectron("music-upload", fileObject);
          }
        };

        reader.readAsArrayBuffer(file);
      });
    }
  };

  return (
    <div className="mb-3">
      <label
        className="block text-lg font-medium text-gray-400 mb-1"
        htmlFor="formFileMultiple"
      >
        Importar Músicas
      </label>
      <input
        onChange={handleFileInputChange}
        className="m-0 w-full max-w-[376px] block min-w-0 rounded border border-solid bg-clip-padding px-3 py-[0.32rem] file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:py-[0.32rem] file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-600 focus:border-blue-600 focus:outline-none border-neutral-600 text-neutral-200 file:bg-neutral-700 file:text-neutral-100"
        type="file"
        multiple
        accept=".mp3,.wav"
      />
    </div>
  );
}
