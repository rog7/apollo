import { ipcRenderer } from "electron";
import { useEffect, useRef } from "react";

const IPCRendererSetup = () => {
  const versionRef = useRef(null);
  const notificationRef = useRef(null);
  const messageRef = useRef(null);
  const restartButtonRef = useRef(null);

  useEffect(() => {
    ipcRenderer.send("app_version");
    ipcRenderer.on("app_version", (event, arg) => {
      ipcRenderer.removeAllListeners("app_version");

      const textNode = document.createTextNode(arg.version);
      versionRef.current.appendChild(textNode);
    });

    ipcRenderer.on("update_available", () => {
      ipcRenderer.removeAllListeners("update_available");
      const textNode = document.createTextNode(
        "A new update is available. Downloading now..."
      );
      messageRef.current.appendChild(textNode);
    });

    ipcRenderer.on("update_downloaded", () => {
      ipcRenderer.removeAllListeners("update_downloaded");
      const textNode = document.createTextNode(
        " Update Downloaded. It will be installed on restart. Restart now?"
      );
      messageRef.current.appendChild(textNode);
    });
  }, []);

  function restartApp() {
    ipcRenderer.send("restart_app");
  }
  return (
    <div>
      <h1>Electron Example</h1>
      <p ref={versionRef}></p>
      <p ref={messageRef}></p>
      <button ref={restartButtonRef} onClick={restartApp}>
        Restart
      </button>
    </div>
  );
};

export default IPCRendererSetup;
