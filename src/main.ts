import {
    App,
    Notice,
    Plugin,
    PluginSettingTab,
    Setting,
 } from "obsidian"

interface MemosPullPluginSettings {
    openID: string,
    memosFolder: string,
}

const DEFAULT_SETTINGS: MemosPullPluginSettings = {
    openID: "",
    memosFolder: "Memos Pull",
}

export default class MemosPullPlugin extends Plugin {
    settings: MemosPullPluginSettings

    async onload() {
        await this.loadSettings()

        this.addSettingTab(new MemosPullSettingTab(this.app, this))
    }

    onunload() {}

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
    }

    async saveSettings() {}

    async pull() {}
}

class MemosPullSettingTab extends PluginSettingTab {
    plugin: MemosPullPlugin

    constructor(app: App, plugin: MemosPullPlugin) {
        super(app, plugin)
        this.plugin = plugin
    }

    display(): void {
        const { containerEl } = this

        containerEl.empty()

        containerEl.createEl("h2", { text: "Settings for Memos Pull." })

        new Setting(containerEl)
            .setName("OpenID")
            .setDesc("Find your OpenID at your Memos Settings.")
            .addText((text) =>
                text
                    .setPlaceholder("Enter your OpenID")
                    .setValue(this.plugin.settings.openID)
                    .onChange(async (value) => {
                        this.plugin.settings.openID = value
                        await this.plugin.saveSettings()
                    })
            )

        new Setting(containerEl)
            .setName("Memos Folder")
            .setDesc("The folder to put memos and resources.")
            .addText((text) =>
                text
                    .setPlaceholder("Enter the folder name")
                    .setValue(this.plugin.settings.memosFolder)
                    .onChange(async (value) => {
                        if (value === "") {
                            new Notice("Please enter the folder name.")
                            return
                        }
                        this.plugin.settings.memosFolder = value
                        await this.plugin.saveSettings()
                    })
            )
    }
}