import BottomBar from "@/components/BottomBar";
import MainScreen from "@/components/MainScreen";
import { Inter } from "next/font/google";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  useEffect(() => {
    window.electronApi.ReceiveFromElectron(
      "toast:receive",
      (_event, message) => {
        toast.success(message);
      }
    );
  }, []);

  return (
    <div
      className={`overflow-hidden relative bg-zinc-900 text-gray-200 flex flex-col min-h-screen ${inter.className}`}
    >
      <ToastContainer
        position="bottom-center"
        autoClose={1000}
        limit={1}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="dark"
      />
      <MainScreen />
      <BottomBar />
    </div>
  );
}
