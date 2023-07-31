export interface MemosApiAccess {
    baseURL: string,
    openID: string,
}

export interface MemosApiResponseMemo {
    id?: number;
    rowStatus?: string;
    creatorId?: number;
    createdTs?: number;
    updatedTs?: number;
    content?: string;
    visibility?: string;
    pinned?: boolean;
    creatorName?: string;
    // TODO handle resource
    // resourceList: any[];
    // TODO handle related
    // relationList: any[];
}

export class MemosApi {
    private baseURL: string;
    private openID: string;

    constructor(baseURL: string, openID: string) {
        this.baseURL = baseURL
        this.openID = openID
    }

    async fetchMemos(): Promise<MemosApiResponseMemo[]> {
        // V1
        const openAPI = `${this.baseURL}/api/v1/memo?openId=${this.openID}`
        const url = new URL(openAPI)
        const response = await fetch(url).then((res) => res.json())
        if (Array.isArray(response)) return response.map((memo) => memo as MemosApiResponseMemo) 
        return [response as unknown as MemosApiResponseMemo]
    }
}