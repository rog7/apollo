import { Menu, app } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import "update-electron-app";

const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1337,
    height: 700,
    resizable: false,
  });

  // const menuTemplate = [
  //   {
  //     label: app.getName(),
  //     submenu: [
  //       {
  //         label: "Quit " + app.getName(),
  //         click: () => {
  //           app.quit();
  //         },
  //         accelerator: "CmdOrCtrl+Q",
  //       },
  //     ],
  //   },
  // ];

  // const menu = Menu.buildFromTemplate(menuTemplate);
  // Menu.setApplicationMenu(menu);

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    // mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});
