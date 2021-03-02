export type PreviewType = "swagger" | "markdown" | "rss";

export interface PreviewInfo {
    id: string
    type: PreviewType
    [key: string]: any
}