import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import PostCard from 'pages/Post/postCard';
import PostSpeedDial from './postSpeedDial';
import { ElBox } from 'components';
import { postService } from 'services';

export default function Home () {
    const [postList, setPostList] = useState([]);

    useEffect(() => getPosts(), []);

    const getPosts = async () => {
        const res = await postService.gePosts();
        if (res && res.code === 200) {
            setPostList(res.value);
        }
    }

    return (
        <Grid mb={15} container>
            {Array.isNullOrEmpty(postList) && <ElBox center flex={1} mt={2}>No Posts</ElBox>}
            {
                !Array.isNullOrEmpty(postList) && postList.map(p => (
                    <Grid key={p.postId} item xs={12}>
                        <PostCard post={p} onDeleted={() => getPosts()} />
                    </Grid>
                ))
            }
            <PostSpeedDial />
        </Grid>
    );
}
