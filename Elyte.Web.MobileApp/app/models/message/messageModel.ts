export interface MessageModel {
    id: string;
    senderId: string;
    senderProfileImage: string;
    senderName: string;
    content: string;
    isSender: boolean;
    isSending?: boolean;
    sendFailed: boolean;
    createdDate: Date;
}
