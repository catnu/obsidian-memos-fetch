import { MemosApi, MemosApiAccess } from "../api/api"
import { Memo } from "./memos";
import { FrontMatterCache, moment } from "obsidian"

export interface SyncMetaData {
    maxUpdateTs: number,
    memosCount: number,
}

export const getSyncMetaData = function (cache: FrontMatterCache): SyncMetaData {
    return <SyncMetaData>{
        maxUpdateTs: cache["memos-fetch-ts"],
        memosCount: cache["memos-fetch-count"]
    }
}

export default class DailyMemos {
    archived: boolean;
    formateDate: string;
    maxUpdateTs: number;
    memos: Memo[];

    constructor(date: string, archived = false) {
        this.formateDate = date
        this.archived = archived
        this.memos = []
    }

    setMaxUpdateTs() {
        if (this.memos.length) {
            this.maxUpdateTs = this.memos.reduce((a, b) => (a.updatedTs || 0) > (b.updatedTs || 0) ? a : b).updatedTs || 0
        }
    }

    getFileName(prefix: string) {
        return `${prefix}${this.formateDate}${this.archived ? '-archived' : ''}.md`
    }

    generateContent(callout: string): string {
        return this.getFrontMatterContent() +
            `#memos\n🕗 date:: ${this.formateDate}\n\n` +
            this.memos.sort((a, b) => (a.createdTs || 0) - (b.createdTs || 0)).map((memo) => {
                const archived = memo.rowStatus == "ARCHIVED"
                return `> ${callout} ${moment((memo.createdTs || 0) * 1000).format(archived ? "YYYY-MM-DD HH:mm" : "HH:mm")
                    }\n${archived ? "> #memos/archived\n>\n" : ""
                    }> ${memo.content?.replace(/\n/g, "\n> ")}\n> ^${memo.createdTs}`
            }).join("\n\n")
    }

    getFrontMatterContent() {
        if (!this.maxUpdateTs) this.setMaxUpdateTs()
        return `---\nmemos-fetch-ts: ${this.maxUpdateTs}\nmemos-fetch-count: ${this.memos.length}\n---\n`
    }

    isSynced(data: SyncMetaData) {
        if (data.memosCount != this.memos.length) return false
        if (!this.maxUpdateTs) this.setMaxUpdateTs()
        return data.maxUpdateTs == this.maxUpdateTs
    }
}

export const featchDailyMemos = async function (access: MemosApiAccess): Promise<DailyMemos[]> {
    const { baseURL, openID } = access
    const api = new MemosApi(baseURL, openID)
    const memos = await api.fetchMemos()
    const collections = new Map<string, DailyMemos>()
    memos.forEach(function (memo) {
        memo = <Memo>memo // cast to Memo, if api change modify here
        const archived = memo.rowStatus == "ARCHIVED"
        // collect archived memo yearly, normal memo daily
        const date = moment((memo.createdTs || 0) * 1000).format(archived ? "YYYY" : "YYYY-MM-DD")
        if (!collections.get(date)) collections.set(date, new DailyMemos(date, archived))
        collections.get(date)?.memos.push(memo)
    })
    return Array.from(collections.values())
}