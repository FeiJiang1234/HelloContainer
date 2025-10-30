import http from './httpService';

function create (data) {
    const formData = new FormData();
    formData.append('details', data.details);
    formData.append('file', data.file);
    return http.post(`posts`, formData);
}

function gePosts () {
    return http.get(`posts`);
}

function gePost (postId) {
    return http.get(`posts/${postId}`);
}

function removePost (postId) {
    return http.delete(`posts/${postId}`);
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

function likePost (athleteId, postId) {
    return http.post(`posts/${postId}/athletes/${athleteId}/like`, {});
}

function unlikePost (athleteId, postId) {
    return http.delete(`posts/${postId}/athletes/${athleteId}/unlike`, {});
}

function favoritePost (athleteId, postId) {
    return http.post(`posts/${postId}/athletes/${athleteId}/favorite`, {});
}

function unFavoritePost (athleteId, postId) {
    return http.delete(`posts/${postId}/athletes/${athleteId}/unFavorite`, {});
}

function getPostComments (postId) {
    return http.get(`posts/${postId}/comments`, { hideGlobalLoading: true });
}

function getPostLikes (postId) {
    return http.get(`posts/${postId}/likes`, { hideGlobalLoading: true });
}

function addCommentReply (data) {
    return http.post(`posts/${data.postId}/comments/${data.commentId}/reply`, data, { hideGlobalLoading: true });
}

function addPostComment (data) {
    return http.post(`posts/${data.postId}/comment`, data, { hideGlobalLoading: true });
}


function createPostStats (data) {
    return http.post(`posts/stats`, data);
}

export default {
    create,
    gePosts,
    gePost,
    removePost,
    likePost,
    unlikePost,
    favoritePost,
    unFavoritePost,
    addPostComment,
    getPostComments,
    addCommentReply,
    deletePostComment,
    sharePost,
    unsharePost,
    getPostLikes,
    createPostStats
};
