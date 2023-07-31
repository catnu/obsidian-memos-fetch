// single memo same to response memo currently
export interface Memo {
    id?: number;
    rowStatus?: string;
    createdTs?: number;
    updatedTs?: number;
    content?: string;
    // visibility?: string;
    // pinned?: boolean;
}