import { useUser } from './useUser';
import React, { useEffect, useState } from 'react';
import { TablePagination } from '@mui/material';
import logger from '../logger';

// TODO: refactor this name after adjusting every view to new search endpoints
export const useNewQueryList = function ({ modelFunction, conditions }) {
    const { spvWalletClient } = useUser();

    const [items, setItems] = useState([]);
    const [itemsCount, setItemsCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [refreshData, setRefreshData] = useState(0);

    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(0);

    const handleLimitChange = (event) => {
        setLimit(event.target.value);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        setPage(0);
    }, [limit]);

    useEffect(() => {
        setLoading(true);
        const queryParams = {
            page: page + 1,
            page_size: limit,
            order_by_field: 'created_at',
            sort_direction: 'desc',
        };
        if (!spvWalletClient) {
            return;
        }
        spvWalletClient[`${modelFunction}`](conditions || {}, {}, queryParams)
            .then((response) => {
                setItems([...response.content]);
                setItemsCount(response.page.totalElements);
                setError('');
                setLoading(false);
            })
            .catch((e) => {
                logger.error(e);
                setError(e.message);
                setLoading(false);
            });
    }, [refreshData, conditions, page, limit]);

    const Pagination = () => {
        return (
            <TablePagination
                component="div"
                count={itemsCount}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                showFirstButton={true}
                showLastButton={true}
            />
        );
    };

    return {
        items,
        loading,
        error,
        setError,
        Pagination,
        refreshData,
        setRefreshData,
        spvWalletClient,
    };
};
