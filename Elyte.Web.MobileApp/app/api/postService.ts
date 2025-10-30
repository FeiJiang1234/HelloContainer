import { CommentModel } from 'el/models/post/commentModel';
import { PageResult } from '../models/pageResult';
import { PostModel } from '../models/post/PostModel';
import { ResponseResult } from '../models/responseResult';
import http from './httpService';

function create(data, file) {
    const formData = new FormData();
    formData.append('details', data.details);
    formData.append('file', file);
    return http.post(`posts`, formData);
}

function getPosts(pageNumber, pageSize) {
    return http.get<null, ResponseResult<PageResult<PostModel>>>(
        `mobile/posts?pageNumber=${pageNumber}&pagesize=${pageSize}`,
    );
}

function getLatestPosts(postsAfter) {
    return http.get<null, ResponseResult<PostModel[]>>(
        `mobile/posts/latest?postsAfter=${postsAfter}`,
    );
}

function addPostComment(data) {
    return http.post(`posts/${data.postId}/comment`, data);
}

function addCommentReply (data) {
    return http.post(`posts/${data.postId}/comments/${data.commentId}/reply`, data);
}

function getPostComments(postId) {
    return http.get<null, ResponseResult<CommentModel[]>>(`posts/${postId}/comments`);
}

function gePost(postId) {
    return http.get(`posts/${postId}`);
}

function likePost(athleteId, postId) {
    return http.post(`posts/${postId}/athletes/${athleteId}/like`, {});
}

function unlikePost(athleteId, postId) {
    return http.delete(`posts/${postId}/athletes/${athleteId}/unlike`, {});
}

function getPostLikes(postId) {
    return http.get(`posts/${postId}/likes`);
}

function favoritePost(athleteId, postId) {
    return http.post(`posts/${postId}/athletes/${athleteId}/favorite`, {});
}

function unFavoritePost(athleteId, postId) {
    return http.delete(`posts/${postId}/athletes/${athleteId}/unFavorite`, {});
}

function sharePost (postId) {
    return http.put(`posts/${postId}/share`);
}

function unsharePost (postId) {
    return http.put(`posts/${postId}/unshare`);
}

function deletePostComment (postId, commentId) {
    return http.delete(`posts/${postId}/comments/${commentId}`, {});
}

function removePost (postId) {
    return http.delete(`posts/${postId}`);
}


function createPostStats (data) {
    return http.post(`posts/stats`, data);
}

export default {
    create,
    getPosts,
    getLatestPosts,
    addPostComment,
    addCommentReply,
    getPostComments,
    gePost,
    likePost,
    unlikePost,
    getPostLikes,
    favoritePost,
    unFavoritePost,
    sharePost,
    unsharePost,
    deletePostComment,
    removePost,
    createPostStats
};
