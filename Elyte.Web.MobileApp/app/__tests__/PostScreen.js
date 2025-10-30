import React from 'react';
import { waitFor } from '@testing-library/react-native';
import postService from '../api/postService';
import PostNavigator from '../navigation/PostNavigator';
import PostCard from '../screen/post/components/PostCard';
import { Provider } from 'react-redux';
import { store } from 'el/store/store';
import { NavigationContainer } from '@react-navigation/native';
import { render } from '@testing-library/react-native';
import { NativeBaseProvider } from 'native-base';

const renderRoot = ui => {
    const inset = {
        frame: { x: 0, y: 0, width: 0, height: 0 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
    };
    return render(
        <NativeBaseProvider initialWindowMetrics={inset}>
            <NavigationContainer>{ui}</NavigationContainer>
        </NativeBaseProvider>,
    );
};

var moment = require('moment');
jest.mock('../api/postService');

const post1 = {
    postId: '1',
    creatorId: '1',
    creatorName: 'fred',
    creatorPictureUrl: 'http:fred.avatar',
    details: 'Today is Friday',
    createdDate: moment.utc(new Date()).format('YYYY-MM-DD HH:m:s'),
    likeCounts: 3,
    commentCounts: 5,
    comments: [
        {
            comment: 'Hello Friday',
            commenterAvatar: 'http:fred.avatar',
            commenterName: 'fred',
            canDelete: true,
        },
        {
            comment: 'Hello Sunday',
            commenterAvatar: 'http:tom.avatar',
            commenterName: 'tom',
            canDelete: false,
        },
    ],
};

const post2 = {
    postId: '2',
    creatorId: '2',
    creatorName: 'tony',
    creatorPictureUrl: 'http:tony.avatar',
    details: 'I love Friday',
    createdDate: moment.utc(new Date()).format('YYYY-MM-DD HH:m:s'),
    likeCounts: 4,
    commentCounts: 10,
};

const mockPosts = {
    value: {
        items: [post1, post2],
        totalCount: 100,
    },
    code: 200,
    message: null,
    errors: null,
};

test('render post screen', async () => {
    postService.getPosts.mockReturnValue(mockPosts);

    // Arrange
    const { getByText } = renderRoot(
        <Provider store={store}>
            <PostNavigator />
        </Provider>,
    );

    // Assert
    await waitFor(() => {
        getByText('fred');
        getByText('Today is Friday');
        getByText('Hello Friday');
        getByText('3 likes 5 comments');
        getByText('Read all comments (5)');
        getByText('tony');
        getByText('I love Friday');
        getByText('Hello Sunday');
        getByText('4 likes 10 comments');
        getByText('Read all comments (10)');
    });
});

test('render post card', () => {
    // Arrange
    const postCard = renderRoot(
        <Provider store={store}>
            <PostCard {...post1} />
        </Provider>,
    );

    // Assert
    expect(postCard).toMatchSnapshot();
});
