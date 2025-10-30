import { CommentModel } from './commentModel';

export interface PostModel {
    postId: string;
    creatorId: string;
    creatorName: string;
    creatorPictureUrl: string;
    details: string;
    imageUrl: string;
    createdDate: Date;
    postType: string;
    statsType: string;
    statsValue: string;
    sportType: string;
    isOfficial: boolean;
    isLike: boolean;
    isFavorite: boolean;
    isCreator: boolean;
    likeCounts: number;
    commentCounts: number;
    isShared: boolean;
    comments: CommentModel[];
    likes: [];
}
