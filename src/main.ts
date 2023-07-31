import { featchDailyMemos, getSyncMetaData } from "./memos/dailyMemos"
import {
    App,
    Notice,
    Plugin,
    PluginSettingTab,
    Setting,
    FrontMatterCache,
    TFile,
} from "obsidian"

interface MemosFetchPluginSettings {
    baseURL: string,
    openID: string,
    memosFolder: string,
    memosPrefix: string,
    memosCallout: string,
}

const DEFAULT_SETTINGS: MemosFetchPluginSettings = {
    baseURL: "",
    openID: "",
    memosFolder: "Memos Fetch",
    memosPrefix: "memos-",
    memosCallout: "[!abstract]",
}

export default class MemosFetchPlugin extends Plugin {
    settings: MemosFetchPluginSettings

    async onload() {
        await this.loadSettings()

        this.addSettingTab(new MemosFetchSettingTab(this.app, this))
        this.addCommand({
            id: "fetch-memos-force-ccw",
            name: "Sync To Remote Discard Local",
            callback: async () => this.fetchMemos(),
        })
    }

    onunload() { }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
    }

    async saveSettings() {
        await this.saveData(this.settings)
    }

    async fetchMemos() {
        const { baseURL, openID, memosFolder, memosPrefix, memosCallout } = this.settings
        if (!baseURL) {
            new Notice("Please set baseURL before fetch memos")
            return
        }
        if (!openID) {
            new Notice("Please set openID before fetch memos")
            return
        }
        try {
            new Notice("Start fetching Memos")
            const dailyMemoses = await featchDailyMemos({
                baseURL: baseURL,
                openID: openID,
            })
            new Notice('Finish fetching Memos')
            await this.createFolderNoExists(memosFolder)
            // TODO handle dailyMemos file exclude in collection
            dailyMemoses.forEach(async (dailyMemos) => {
                const year = dailyMemos.formateDate.slice(0, 4)
                const yearFolder = `${memosFolder}/${year}`
                await this.createFolderNoExists(yearFolder)
                const filePath = `${yearFolder}/${memosPrefix}${dailyMemos.formateDate}.md`
                if (await this.app.vault.adapter.exists(filePath)) {
                    // rewrite or skip
                    const cache = this.getFrontMatterCache(filePath)
                    if (!cache || !dailyMemos.isSynced(getSyncMetaData(cache))) {
                        await this.app.vault.adapter.write(filePath, dailyMemos.generateContent(memosCallout))
                        new Notice(`update ${filePath}`)
                    }
                } else {
                    // create file
                    await this.app.vault.create(filePath, dailyMemos.generateContent(memosCallout))
                    new Notice(`create ${filePath}`)
                }
            })
        } catch (e) {
            new Notice(
                "Failed to fetch memos. Please check your setting and network.",
                0
            )
            console.error(e)
        }
    }

    getFrontMatterCache(filePath: string): FrontMatterCache | undefined {
        const tfile = this.app.vault.getAbstractFileByPath(filePath)
        if (tfile instanceof TFile && tfile.extension == "md") {
            const cacheData = this.app.metadataCache.getFileCache(tfile) || {}
            return cacheData.frontmatter
        }
        return undefined
    }

    async createFolderNoExists(folder: string) {
        if (!(await this.app.vault.adapter.exists(folder))) {
            await this.app.vault.createFolder(folder)
        }
    }
}

class MemosFetchSettingTab extends PluginSettingTab {
    plugin: MemosFetchPlugin

    constructor(app: App, plugin: MemosFetchPlugin) {
        super(app, plugin)
        this.plugin = plugin
    }

    displayProperty(container: HTMLElement, key: string, desc: string, prompt: string, trim = false): void {
        const attr = key as keyof typeof this.plugin.settings
        new Setting(container)
            .setName(key)
            .setDesc(desc)
            .addText((text) =>
                text
                    .setPlaceholder(prompt)
                    .setValue(this.plugin.settings[attr])
                    .onChange(async (value) => {
                        if (trim) value = value.replace(/^\/+|\/+$/g, '')
                        this.plugin.settings[attr] = value
                        await this.plugin.saveSettings()
                    })
            )
    }

    display(): void {
        const { containerEl } = this
        containerEl.empty()

        this.displayProperty(containerEl, "baseURL", "Find your baseURL at your Memos Settings", "Enter your baseURL like https://host")
        this.displayProperty(containerEl, "openID", "Find your openID at your Memos Settings", "Enter your openID")
        this.displayProperty(containerEl, "memosFolder", "The folder to put memos and resources.", "Enter the folder name", true)
        this.displayProperty(containerEl, "memosPrefix", "The prefix for every daily memos file in memosFolder.", "Enter the prefix string", true)
        this.displayProperty(containerEl, "memosCallout", "The callout style for every memo.", "Enter the callout", true)
        containerEl.createEl("a", { text: "see more callouts", href: "https://help.obsidian.md/Editing+and+formatting/Callouts" })
    }
}