export interface Notification {
    id: string,
    title: string,
    body: string,
    isRead: boolean,
    createAt: string,
    type?: string,
    link?: string,
}