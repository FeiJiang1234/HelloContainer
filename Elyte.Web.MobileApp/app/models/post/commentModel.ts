export interface CommentModel {
    postId: string;
    commentId: string;
    comment: string;
    createdDate: Date;
    canDelete: boolean;
    commenterId: string;
    commenterAvatar: string;
    commenterName: string;
    replyerId: string;
    replyerAvatar: string;
    replyerName: string;
}
