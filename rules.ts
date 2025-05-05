import fs from "fs";
import { KarabinerRules } from "./types";
import { createHyperSubLayers, app, open, yabai, shell } from "./utils";

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
    spacebar: open(
      "raycast://extensions/stellate/mxstbr-commands/create-notion-todo"
    ),
    // b = "B"rowse
    b: {
      t: open("https://twitter.com"),
      // Quarterly "P"lan
      p: open("https://mxstbr.com/cal"),
      y: open("https://news.ycombinator.com"),
      f: open("https://facebook.com"),
      r: open("https://reddit.com"),
      h: open("https://hashnode.com/draft"),
    },
    // o = "Open" applications
    o: {
      b: app("Bitwarden"),
      g: app("Safari"),
      c: app("Calendar"),
      d: app("Discord"),
      k: app("Slack"),
      t: app("Terminal"),
      f: app("Finder"),
      s: app("Spotify"),
      w: open("WhatsApp"),
    },

    // TODO: This doesn't quite work yet.
    // l = "Layouts" via Raycast's custom window management
    // l: {
    //   // Coding layout
    //   c: shell`
    //     open -a "Visual Studio Code.app"
    //     sleep 0.2
    //     open -g "raycast://customWindowManagementCommand?position=topLeft&relativeWidth=0.5"

    //     open -a "Terminal.app"
    //     sleep 0.2
    //     open -g "raycast://customWindowManagementCommand?position=topRight&relativeWidth=0.5"
    //   `,
    // },
    w: {
        // 1) Hyper + hjkl → focus windows
        h: yabai("window --focus west",  "Window: Focus Left"),   // swap at left :contentReference[oaicite:1]{index=1}
        j: yabai("window --focus south", "Window: Focus Down"),   // swap at bottom :contentReference[oaicite:2]{index=2}
        k: yabai("window --focus north", "Window: Focus Up"),     // swap at top :contentReference[oaicite:3]{index=3}
        l: yabai("window --focus east",  "Window: Focus Right"),  // swap at right :contentReference[oaicite:4]{index=4}

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

    // s = "System"
    s: {
      u: {
        to: [
          {
            key_code: "volume_increment",
          },
        ],
      },
      j: {
        to: [
          {
            key_code: "volume_decrement",
          },
        ],
      },
      i: {
        to: [
          {
            key_code: "display_brightness_increment",
          },
        ],
      },
      k: {
        to: [
          {
            key_code: "display_brightness_decrement",
          },
        ],
      },
      l: {
        to: [
          {
            key_code: "q",
            modifiers: ["right_control", "right_command"],
          },
        ],
      },
      p: {
        to: [
          {
            key_code: "play_or_pause",
          },
        ],
      },
      semicolon: {
        to: [
          {
            key_code: "fastforward",
          },
        ],
      },
      e: open(
        `raycast://extensions/thomas/elgato-key-light/toggle?launchType=background`
      ),
      // "D"o not disturb toggle
      d: open(
        `raycast://extensions/yakitrak/do-not-disturb/toggle?launchType=background`
      ),
      // "T"heme
      t: open(`raycast://extensions/raycast/system/toggle-system-appearance`),
      c: open("raycast://extensions/raycast/system/open-camera"),
      // 'v'oice
      v: {
        to: [
          {
            key_code: "spacebar",
            modifiers: ["left_option"],
          },
        ],
      },
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

    // r = "Raycast"
    r: {
      c: open("raycast://extensions/thomas/color-picker/pick-color"),
      n: open("raycast://script-commands/dismiss-notifications"),
      l: open(
        "raycast://extensions/stellate/mxstbr-commands/create-mxs-is-shortlink"
      ),
      e: open(
        "raycast://extensions/raycast/emoji-symbols/search-emoji-symbols"
      ),
      p: open("raycast://extensions/raycast/raycast/confetti"),
      a: open("raycast://extensions/raycast/raycast-ai/ai-chat"),
      s: open("raycast://extensions/peduarte/silent-mention/index"),
      h: open(
        "raycast://extensions/raycast/clipboard-history/clipboard-history"
      ),
      1: open(
        "raycast://extensions/VladCuciureanu/toothpick/connect-favorite-device-1"
      ),
      2: open(
        "raycast://extensions/VladCuciureanu/toothpick/connect-favorite-device-2"
      ),
    },
  }),
  {
    description: "Change Backspace to Spacebar when Minecraft is focused",
    manipulators: [
      {
        type: "basic",
        from: {
          key_code: "delete_or_backspace",
        },
        to: [
          {
            key_code: "spacebar",
          },
        ],
        conditions: [
          {
            type: "frontmost_application_if",
            file_paths: [
              "^/Users/mxstbr/Library/Application Support/minecraft/runtime/java-runtime-gamma/mac-os-arm64/java-runtime-gamma/jre.bundle/Contents/Home/bin/java$",
            ],
          },
        ],
      },
    ],
  },
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
