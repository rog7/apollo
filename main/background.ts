import { Menu, app, ipcMain } from "electron";
import prompt from "electron-prompt";
import serve from "electron-serve";
import { autoUpdater } from "electron-updater";
import { createWindow } from "./helpers";

import { powerSaveBlocker } from "electron";

const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  powerSaveBlocker.start("prevent-app-suspension");

  const mainWindow = createWindow("main", {
    width: 1337,
    height: 700,
    resizable: false,
    maximizable: false,
  });

  // const secondWindow = createWindow("main", {
  //   width: 1337,
  //   height: 700,
  //   resizable: false,
  //   maximizable: false,
  // });

  if (isProd) {
    mainWindow.once("ready-to-show", () => {
      autoUpdater.checkForUpdatesAndNotify();
    });

    autoUpdater.on("update-downloaded", () => {
      mainWindow.webContents.send("update_downloaded");
    });

    ipcMain.on("restart_app", () => {
      autoUpdater.quitAndInstall();
    });
  }

  const menuTemplate = [
    {
      label: app.getName(),
      submenu: [
        {
          label: "Quit " + app.getName(),
          click: () => {
            app.quit();
          },
          accelerator: "CmdOrCtrl+Q",
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate as any);
  Menu.setApplicationMenu(menu);

  ipcMain.on("recreate_menu", (_, args) => {
    const midiInputSubMenu =
      args[5].length === 0
        ? [{ label: "No Midi Inputs Available" }]
        : args[5].map((name) => {
            return {
              label: name,
              type: "radio",
              click: () => {
                mainWindow.webContents.send("midi_input_selected", [name]);
              },
              checked: name === args[6],
            };
          });

    const menuTemplate = [
      {
        label: app.getName(),
        submenu: [
          {
            label: "Quit " + app.getName(),
            click: () => {
              app.quit();
            },
            accelerator: "CmdOrCtrl+Q",
          },
        ],
      },
      {
        label: "Options",
        submenu: [
          {
            label: "Theme",
            submenu: [
              {
                id: "light-mode",
                label: "Light Theme",
                type: "radio",
                click: () => {
                  mainWindow.webContents.send("light_theme_clicked");
                },
                accelerator: "CmdOrCtrl+Shift+L",
                checked: args[1] === "light-mode",
              },
              {
                id: "dark-mode",
                label: "Dark Theme",
                type: "radio",
                click: () => {
                  mainWindow.webContents.send("dark_theme_clicked");
                },
                accelerator: "CmdOrCtrl+Shift+D",
                checked: args[1] === "dark-mode",
              },
            ],
          },
          {
            label: "Color",
            click: () => {
              prompt({
                title: "Enter a note on color",
                label: "Hex code:",
                value: args[2],
                type: "input",
              })
                .then((result) => {
                  if (result) {
                    args = [...args.slice(0, 2), result, ...args.slice(3)];
                    mainWindow.webContents.send("color_changed", args);
                  }
                })
                .catch((err) => {
                  console.error(err);
                });
            },
            accelerator: "CmdOrCtrl+Shift+C",
          },
          {
            label: "Enable Sound",
            type: "checkbox",
            click: () => {
              mainWindow.webContents.send("enable_sound_clicked", [
                ...args.slice(0, 8),
                !args[8],
              ]);
            },
            accelerator: "CmdOrCtrl+Shift+S",
            checked: args[8] === true,
          },
          {
            label: "Show Chord Numbers",
            type: "checkbox",
            click: () => {
              args[7]
                ? mainWindow.webContents.send("show_chord_numbers_clicked")
                : mainWindow.webContents.send("premium_feature_clicked", args);
            },
            accelerator: "CmdOrCtrl+Shift+N",
            checked: args[3] === true,
          },
          {
            label: "Show Alternate Chord Names",
            type: "checkbox",
            click: () => {
              args[7]
                ? mainWindow.webContents.send("show_alt_chord_names_clicked")
                : mainWindow.webContents.send("premium_feature_clicked", args);
            },
            accelerator: "CmdOrCtrl+Shift+A",
            checked: args[4] === true,
          },
          {
            label: "Edit Profile",
            click: () => {
              mainWindow.webContents.send("edit_profile_clicked");
            },
            accelerator: "CmdOrCtrl+Shift+E",
          },
        ],
      },
      {
        label: "Key",
        submenu: [
          {
            label: "Ab",
            type: "radio",
            click: () => {
              args[7]
                ? mainWindow.webContents.send("key_preference_clicked", ["Ab"])
                : mainWindow.webContents.send("premium_feature_clicked", args);
            },
            checked: args[0] === "Ab",
          },
          {
            label: "A",
            type: "radio",
            click: () => {
              args[7]
                ? mainWindow.webContents.send("key_preference_clicked", ["A"])
                : mainWindow.webContents.send("premium_feature_clicked", args);
            },
            checked: args[0] === "A",
          },
          {
            label: "Bb",
            type: "radio",
            click: () => {
              args[7]
                ? mainWindow.webContents.send("key_preference_clicked", ["Bb"])
                : mainWindow.webContents.send("premium_feature_clicked", args);
            },
            checked: args[0] === "Bb",
          },
          {
            label: "B",
            type: "radio",
            click: () => {
              args[7]
                ? mainWindow.webContents.send("key_preference_clicked", ["B"])
                : mainWindow.webContents.send("premium_feature_clicked", args);
            },
            checked: args[0] === "B",
          },
          {
            label: "C",
            type: "radio",
            click: () => {
              args[7]
                ? mainWindow.webContents.send("key_preference_clicked", ["C"])
                : mainWindow.webContents.send("premium_feature_clicked", args);
            },
            checked: args[0] === "C",
          },
          {
            label: "Db",
            type: "radio",
            click: () => {
              args[7]
                ? mainWindow.webContents.send("key_preference_clicked", ["Db"])
                : mainWindow.webContents.send("premium_feature_clicked", args);
            },
            checked: args[0] === "Db",
          },
          {
            label: "D",
            type: "radio",
            click: () => {
              args[7]
                ? mainWindow.webContents.send("key_preference_clicked", ["D"])
                : mainWindow.webContents.send("premium_feature_clicked", args);
            },
            checked: args[0] === "D",
          },
          {
            label: "Eb",
            type: "radio",
            click: () => {
              args[7]
                ? mainWindow.webContents.send("key_preference_clicked", ["Eb"])
                : mainWindow.webContents.send("premium_feature_clicked", args);
            },
            checked: args[0] === "Eb",
          },
          {
            label: "E",
            type: "radio",
            click: () => {
              args[7]
                ? mainWindow.webContents.send("key_preference_clicked", ["E"])
                : mainWindow.webContents.send("premium_feature_clicked", args);
            },
            checked: args[0] === "E",
          },
          {
            label: "F",
            type: "radio",
            click: () => {
              args[7]
                ? mainWindow.webContents.send("key_preference_clicked", ["F"])
                : mainWindow.webContents.send("premium_feature_clicked", args);
            },
            checked: args[0] === "F",
          },
          {
            label: "F#",
            type: "radio",
            click: () => {
              args[7]
                ? mainWindow.webContents.send("key_preference_clicked", ["F#"])
                : mainWindow.webContents.send("premium_feature_clicked", args);
            },
            checked: args[0] === "F#",
          },
          {
            label: "G",
            type: "radio",
            click: () => {
              args[7]
                ? mainWindow.webContents.send("key_preference_clicked", ["G"])
                : mainWindow.webContents.send("premium_feature_clicked", args);
            },
            checked: args[0] === "G",
          },
        ],
      },
      // {
      //   label: "Midi Input",
      //   submenu: midiInputSubMenu,
      // },
    ];

    // Rebuild the menu
    const menu = Menu.buildFromTemplate(menuTemplate as any);
    Menu.setApplicationMenu(menu);
  });

  if (isProd) {
    await mainWindow.loadURL("app://./home.html");
    // mainWindow.webContents.openDevTools();
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    // await secondWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
    // secondWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});
