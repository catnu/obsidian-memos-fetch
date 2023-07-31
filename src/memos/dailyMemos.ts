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
    formateDate: string;
    maxUpdateTs: number;
    memos: Memo[];

    constructor(date: string) {
        this.formateDate = date
        this.memos = []
    }

    setMaxUpdateTs() {
        if (this.memos.length) {
            this.maxUpdateTs = this.memos.reduce((a, b) => (a.updatedTs || 0) > (b.updatedTs || 0) ? a : b).updatedTs || 0
        }
    }

    generateContent(callout: string): string {
        return this.getFrontMatterContent() +
            `#memos\n🕗 date:: ${this.formateDate}\n\n` +
            this.memos.sort((a, b) => (a.createdTs || 0) - (b.createdTs || 0)).map((memo) =>
                `> ${callout} ${moment((memo.createdTs || 0) * 1000).format("HH:mm")}\n${
                    memo.rowStatus == "ARCHIVED" ? "> #memos/archived\n" : ""
                }> ${memo.content?.replace(/\n/g, "\n> ")}\n> ^${memo.createdTs}`).join("\n\n")
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
    const daily = new Map<string, DailyMemos>()
    memos.forEach(function (memo) {
        memo = <Memo>memo // cast to Memo, if api change modify here
        const date = moment((memo.createdTs || 0) * 1000).format("YYYY-MM-DD")
        if (!daily.get(date)) daily.set(date, new DailyMemos(date))
        daily.get(date)?.memos.push(memo)
    })
    return Array.from(daily.values())
}