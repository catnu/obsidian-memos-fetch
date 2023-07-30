import {
    App,
    Notice,
    Plugin,
    PluginSettingTab,
    Setting,
} from "obsidian"

interface MemosPullPluginSettings {
    baseURL: string,
    openID: string,
    memosFolder: string,
}

const DEFAULT_SETTINGS: MemosPullPluginSettings = {
    baseURL: "",
    openID: "",
    memosFolder: "Memos Pull",
}

export default class MemosPullPlugin extends Plugin {
    settings: MemosPullPluginSettings

    async onload() {
        await this.loadSettings()

        this.addSettingTab(new MemosPullSettingTab(this.app, this))
    }

    onunload() { }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
    }

    async saveSettings() { }

    async pull() { }
}

class MemosPullSettingTab extends PluginSettingTab {
    plugin: MemosPullPlugin

    constructor(app: App, plugin: MemosPullPlugin) {
        super(app, plugin)
        this.plugin = plugin
    }

    displayProperty(container: HTMLElement, key: string, desc: string, prompt: string): void {
        const attr = key as keyof typeof this.plugin.settings
        new Setting(container)
            .setName(key)
            .setDesc(desc)
            .addText((text) =>
                text
                    .setPlaceholder(prompt)
                    .setValue(this.plugin.settings[attr])
                    .onChange(async (value) => {
                        this.plugin.settings[attr] = value
                        await this.plugin.saveSettings()
                    })
            )
    }

    display(): void {
        const { containerEl } = this
        containerEl.empty()
        containerEl.createEl("h2", { text: "Settings for Memos Pull" })
        this.displayProperty(containerEl, "baseURL", "Find your baseURL at your Memos Settings", "Enter your baseURL like https://host")
        this.displayProperty(containerEl, "openID", "Find your openID at your Memos Settings", "Enter your openID")
        this.displayProperty(containerEl, "memosFolder", "The folder to put memos and resources.", "Enter the folder name")
    }
}