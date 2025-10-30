import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { PostModel } from 'el/models/post/PostModel';
import { CommentModel } from 'el/models/post/commentModel';

const initialState: PostModel[] = [];

export const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        GET_POSTS: (state, action: PayloadAction<PostModel[]>) => [...action.payload],
        DELETE_POST: (state, action: PayloadAction<string>) =>
            state.filter(x => x.postId !== action.payload),
        GET_LATEST_POSTS: (state, action: PayloadAction<PostModel[]>) => [
            ...action.payload,
            ...(state || []),
        ],
        GET_COMMENTS: (state, action: PayloadAction<CommentModel[]>) => {
            const post = state.find(x => x.postId === action.payload[0].postId);
            if (!post) return;

            post.commentCounts = action.payload.length;
            post.comments = action.payload;
        },
        CLEAR_POST: () => [],
        ADD_POSTS: (state, action: PayloadAction<PostModel[]>) => [...state, ...action.payload],
    },
});

export const { GET_POSTS, GET_LATEST_POSTS, GET_COMMENTS, CLEAR_POST, DELETE_POST, ADD_POSTS } = postSlice.actions;
export default postSlice.reducer;
