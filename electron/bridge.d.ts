import { api } from "./preload";

declare global {
  interface Window {
    electronApi: typeof api;
  }
}
