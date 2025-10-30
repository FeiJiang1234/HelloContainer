import { useState } from 'react';

const useLoadMore = (pageSize = 10) => {
    const firstPage = 1;
    const [data, setData] = useState<Array<any>>([]);
    const [hasMore, setHasMore] = useState(false);
    const [pageNumber, setPageNumber] = useState(firstPage);

    const initData = items => {
        setHasMore(items.length >= pageSize);
        setPageNumber(firstPage + 1);
        setData(items);
    };

    const loadMoreData = items => {
        if (items.length < pageSize) setHasMore(false);

        const itemIds = data.map(item => item.id);
        const restItems = items.filter(x => itemIds.indexOf(x.id) === -1);
        setPageNumber(i => i + 1);
        setData(pre => [...pre, ...restItems]);
    };

    return {
        data,
        setData,
        pageNumber,
        pageSize,
        initData,
        loadMoreData,
        hasMore,
    };
};

export default useLoadMore;
