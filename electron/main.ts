import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import fs from "node:fs";

let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL("http://localhost:3000");
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  const minWidth = 680;
  const minHeight = 375;

  mainWindow.setMinimumSize(minWidth, minHeight);
}

app.whenReady().then(async () => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

const musicDir = path.join(__dirname, "..", "public", "musics");

ipcMain.on("music-upload", (_event, file) => {
  const filePath = path.join(musicDir, file.name);
  fs.writeFile(filePath, file.data, (error) => {
    if (error) {
      mainWindow?.webContents.send("toast:receive", error);
    } else {
      sendUpdatedList();
      mainWindow?.webContents.send(
        "toast:receive",
        "Arquivo enviado com sucesso!"
      );
    }
  });
});

ipcMain.on("music-get", () => {
  sendUpdatedList();
});

ipcMain.on("music-delete", (_event, music) => {
  const filePath = path.join(musicDir, music);
  fs.unlink(filePath, (error) => {
    if (error) {
      mainWindow?.webContents.send("toast:receive", error);
    } else {
      sendUpdatedList();
      mainWindow?.webContents.send(
        "toast:receive",
        "Música excluída com sucesso!"
      );
      mainWindow?.webContents.send("music-deleted", music)
    }
  });
});

ipcMain.on("music-to-play", (_event, music) => {
  mainWindow?.webContents.send("music-playable", music);
});

async function sendUpdatedList() {
  try {
    const files = (await fs.promises.readdir(musicDir)).filter(
      (file) => file !== ".gitkeep"
    );

    mainWindow?.webContents.send("music-list", files);
  } catch (error) {
    mainWindow?.webContents.send("toast:receive", error);
  }
}
