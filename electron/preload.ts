import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";

export const api = {
  SendToElectron: (channel: string, data?: any) =>
    ipcRenderer.send(channel, data),
  ReceiveFromElectron: (
    channel: string,
    func: (event: IpcRendererEvent, ...args: any[]) => void
  ) => ipcRenderer.on(channel, (event, ...args) => func(event, ...args)),
  BidirectionalCommunication: (channel: string) => ipcRenderer.invoke(channel),
};

contextBridge.exposeInMainWorld("electronApi", api);
