import { Component, h, render } from "preact";
import { Computer } from "./computer";
import { Cog, Info } from "./font";
import { About } from "./screens";
import { Settings } from "./settings";
import * as storage from "./storage";

type MainState = {
  settings: Settings,

  currentVDom: (state: MainState) => JSX.Element,
  dialogue?: (state: MainState) => JSX.Element,
};

class Main extends Component<{}, MainState> {
  public constructor(props: {}, context: any) {
    super(props, context);
  }

  public componentWillMount() {
    const settings: Settings = {
      showInvisible: true,
      trimWhitespace: true,

      terminalFont: "assets/term_font.png",

      darkMode: false,
      terminalBorder: false,
    };

    // Sync settings from local storage
    const settingJson = storage.get("settings");
    if (settingJson !== null) {
      try {
        const settingStorage = JSON.parse(settingJson);
        for (const key of Object.keys(settings)) {
          const value = settingStorage[key];
          if (value !== undefined) (settings as any)[key] = value;
        }
      } catch (e) {
        console.error("Cannot read settings", e);
      }
    }

    this.state = {
      settings,
      currentVDom: this.computerVDom,
    };
  }

  public shouldComponentUpdate({}: {}, newState: MainState) {
    return this.state.currentVDom !== newState.currentVDom ||
      this.state.dialogue !== newState.dialogue ||
      this.state.settings !== newState.settings;
  }

  public componentDidUpdate() {
    storage.set("settings", JSON.stringify(this.state.settings));
  }

  public render({}: {}, state: MainState) {
    return <div class="container">
      {state.currentVDom(state)}
      <div class="info-buttons">
        <button class="action-button" title="Configure how the emulator behaves"
          onClick={this.openSettings}>
          <Cog />
        </button>
        <button class="action-button" title="Find out more about the emulator"
          onClick={() => this.setState({ dialogue: () => <About />})}>
          <Info />
        </button>
      </div>
      {
        state.dialogue ?
          <div class="dialogue-overlay" onClick={this.closeDialogueClick}>
            {state.dialogue(state)}
          </div> : ""
      }
    </div>;
  }

  private openSettings = () => {
    const update = (s: Settings) => this.setState({ settings: s });
    this.setState({ dialogue: (s: MainState) => <Settings settings={s.settings} update={update} /> });
  }

  private closeDialogueClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) this.setState({ dialogue: undefined });
  }

  private computerVDom = ({ settings, dialogue }: MainState) => {
    return <Computer settings={settings} focused={dialogue === undefined} />;
  }
}

export default () => {
  // Start the window!
  const page = document.getElementById("page") as HTMLElement;
  render(<Main />, page, page.lastElementChild || undefined);
};
