import fs from "fs";
import { KarabinerRules } from "./types";
import { createHyperSubLayers, app, open, newSafariWindow, newTerminalWindow, newFinderWindow, yabai, shell } from "./utils";

const rules: KarabinerRules[] = [
  // Define the Hyper key itself
  {
    description: "Hyper Key (⌃⌥⇧⌘)",
    manipulators: [
      {
        description: "Caps Lock -> Hyper Key",
        from: {
          key_code: "caps_lock",
          modifiers: {
            optional: ["any"],
          },
        },
        to: [
          {
            set_variable: {
              name: "hyper",
              value: 1,
            },
          },
        ],
        to_after_key_up: [
          {
            set_variable: {
              name: "hyper",
              value: 0,
            },
          },
        ],
        to_if_alone: [
          {
            key_code: "escape",
          },
        ],
        type: "basic",
      },
      //      {
      //        type: "basic",
      //        description: "Disable CMD + Tab to force Hyper Key usage",
      //        from: {
      //          key_code: "tab",
      //          modifiers: {
      //            mandatory: ["left_command"],
      //          },
      //        },
      //        to: [
      //          {
      //            key_code: "tab",
      //          },
      //        ],
      //      },
    ],
  },
  ...createHyperSubLayers({
    // 1) Hyper + hjkl → focus windows
    h: yabai("window --focus west",  "Window: Focus Left"),
    j: yabai("window --focus south", "Window: Focus Down"),
    k: yabai("window --focus north", "Window: Focus Up"),
    l: yabai("window --focus east",  "Window: Focus Right"),
    // 3) Hyper + 1–9 → focus space (desktop)
    1: yabai("space --focus 1", "Space → 1"),  
    2: yabai("space --focus 2", "Space → 2"),
    3: yabai("space --focus 3", "Space → 3"),
    4: yabai("space --focus 4", "Space → 4"),
    5: yabai("space --focus 5", "Space → 5"),
    6: yabai("space --focus 6", "Space → 6"),
    7: yabai("space --focus 7", "Space → 7"),
    8: yabai("space --focus 8", "Space → 8"),
    9: yabai("space --focus 9", "Space → 9"),  // focus by index :contentReference[oaicite:6]{index=6}
    // b = "B"rowse
    b: {
      t: open("https://twitter.com"),
      y: open("https://news.ycombinator.com"),
      f: open("https://facebook.com"),
      r: open("https://reddit.com"),
    },
    // o = "Open" applications
    o: {
      b: app("Bitwarden"),
      s: app("Safari"),
      c: app("Calendar"),
      d: app("Discord"),
      k: app("Slack"),
      t: app("Terminal"),
      f: app("Finder"),
      p: app("Spotify"),
      w: open("WhatsApp"),
    },

    n: {
      g: newSafariWindow(),
      t: newTerminalWindow(),
      f: newFinderWindow(),
    },
    w: {

        // 2) Hyper + ⌘ + hjkl → resize focused window
        // note: since createHyperSubLayer matches any modifiers, we detect ⌘ in `to`
        // by using inline shell commands with `--resize abs:` or `bottom_right:…`
        H: {
          description: "Window: Shrink Width",
          to: [{ shell_command: `yabai -m window --resize left:50:0` }],
        },
        J: {
          description: "Window: Grow Height",
          to: [{ shell_command: `yabai -m window --resize bottom:0:50` }],
        },
        K: {
          description: "Window: Shrink Height",
          to: [{ shell_command: `yabai -m window --resize top:0:50` }],
        },
        L: {
          description: "Window: Grow Width",
          to: [{ shell_command: `yabai -m window --resize right:50:0` }],
        },
        // uses absolute or relative resizing options :contentReference[oaicite:5]{index=5}


        // 4) Hyper + ⌘ + 1–9 → move window to space X and follow focus
        "!1": {  // use an unused key alias; Karabiner will still match Hyper+⌘+1
          description: "Send → Space 1",
          to: [{ shell_command: "yabai -m window --space 1; yabai -m space --focus 1" }],
        },
        "!2": {
          description: "Send → Space 2",
          to: [{ shell_command: "yabai -m window --space 2; yabai -m space --focus 2" }],
        },
        "!3": {
          description: "Send → Space 3",
          to: [{ shell_command: "yabai -m window --space 3; yabai -m space --focus 3" }],
        },
        // …repeat for 4 through 9…
        // uses `--space <index> --focus` pattern :contentReference[oaicite:7]{index=7}
      },

    // v = "moVe" which isn't "m" because we want it to be on the left hand
    // so that hjkl work like they do in vim
    v: {
      h: {
        to: [{ key_code: "left_arrow" }],
      },
      j: {
        to: [{ key_code: "down_arrow" }],
      },
      k: {
        to: [{ key_code: "up_arrow" }],
      },
      l: {
        to: [{ key_code: "right_arrow" }],
      },
      // Magicmove via homerow.app
      m: {
        to: [{ key_code: "f", modifiers: ["right_control"] }],
        // TODO: Trigger Vim Easymotion when VSCode is focused
      },
      // Scroll mode via homerow.app
      s: {
        to: [{ key_code: "j", modifiers: ["right_control"] }],
      },
      d: {
        to: [{ key_code: "d", modifiers: ["right_shift", "right_command"] }],
      },
      u: {
        to: [{ key_code: "page_down" }],
      },
      i: {
        to: [{ key_code: "page_up" }],
      },
    },

    // c = Musi*c* which isn't "m" because we want it to be on the left hand
    c: {
      p: {
        to: [{ key_code: "play_or_pause" }],
      },
      n: {
        to: [{ key_code: "fastforward" }],
      },
      b: {
        to: [{ key_code: "rewind" }],
      },
    },
  }),
];

fs.writeFileSync(
  "karabiner.json",
  JSON.stringify(
    {
      global: {
        show_in_menu_bar: false,
      },
      profiles: [
        {
          name: "Default",
          complex_modifications: {
            rules,
          },
        },
      ],
    },
    null,
    2
  )
);
