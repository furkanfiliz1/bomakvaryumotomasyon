import { HUMAN_READABLE_DATE, INITIAL_TABLE_PAGE_SIZE } from '@constant';
import { emptyOrNullRemoveQuery, getFromParams } from '@helpers';
import { BaseQueryFn, FetchArgs, QueryDefinition } from '@reduxjs/toolkit/dist/query';
import { UseLazyQuery } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { ExceptionResponseModel } from '@store';
import dayjs from 'dayjs';
import FileSaver from 'file-saver';
import { pickBy } from 'lodash';
import { useCallback, useEffect, useRef } from 'react';
import { PagingConfig, SortingConfig } from 'src/components/common/Table/types';

interface Options {
  lazyQuery?: boolean;
}

export type ServerSideQueryArgs = {
  page?: number;
  pageSize?: number;
  sortType?: string;
  isExport?: boolean;
  sort?: string;
};
export type ServerSideQueryResult<T = object> = {
  Data?: T[] | null;
  Items?: T[] | null;
  TotalCount?: number;
  ExtensionData?: string | null;
};
type PaginableQueryType<RES, ARGS> = UseLazyQuery<
  QueryDefinition<
    ARGS,
    BaseQueryFn<
      string | FetchArgs,
      unknown,
      {
        data: ExceptionResponseModel;
      },
      object
    >,
    never,
    RES,
    'baseApiReducer'
  >
>;

/**
 *
 * @param query Lazy query satisfying PaginableQueryType
 * @param queryArgs Query argument params
 * @returns Paginable react-query
 */
const useServerSideQuery = <RES extends ServerSideQueryResult, ARGS extends ServerSideQueryArgs>(
  query: PaginableQueryType<RES, ARGS>,
  params: ARGS = {} as ARGS,
  options?: Options,
) => {
  if (typeof query !== 'function') throw Error('Query is not defined');

  const previousFetchParams = useRef<ARGS>({} as ARGS);
  const [getQuery, { data, error, originalArgs, ...rest }] = query();

  useEffect(() => {
    const defaultParams = {
      page: getFromParams('page') ?? params.page ?? 1,
      pageSize: getFromParams('pageSize') ?? params.pageSize ?? INITIAL_TABLE_PAGE_SIZE,
    };

    const newParams = { ...previousFetchParams.current, ...params, ...defaultParams };

    if (!options?.lazyQuery) {
      getQuery(newParams);
    }

    previousFetchParams.current = newParams;
  }, [getQuery, options?.lazyQuery, params]);

  const refetch = useCallback(() => getQuery(previousFetchParams.current), [getQuery]);

  const fetch = useCallback(
    (values: ARGS) => {
      const newParams = { ...previousFetchParams.current, ...values };
      const _values = pickBy(newParams, (value) => value !== null && value !== undefined) as ARGS;
      getQuery(_values);
      previousFetchParams.current = newParams;
    },
    [getQuery],
  );

  const onPageChange = (newPage: number) => {
    fetch({ page: newPage } as ARGS);
  };

  const onPageSizeChange = (newPageSize: number) => {
    fetch({ pageSize: newPageSize, page: 1 } as ARGS);
  };

  const onSort = (field: string, order: string) => {
    fetch({ sort: field, sortType: order } as ARGS);
  };

  const handleExport = (fileName: string) => {
    const newParams = { ...originalArgs, ...previousFetchParams.current, isExport: true };
    const clearParams = { ...emptyOrNullRemoveQuery(newParams), isExport: true } as ARGS;
    getQuery(clearParams).then((res) => {
      if (!res.data?.ExtensionData) return;

      FileSaver.saveAs(
        `data:xls;base64,${res.data.ExtensionData}`,
        `${fileName}_${dayjs().format(HUMAN_READABLE_DATE)}.xls`,
      );
    });
    previousFetchParams.current = { ...clearParams, isExport: false };
  };

  const pagingConfig: PagingConfig = {
    page: previousFetchParams.current?.page || 1, // API uses 1-based pagination
    rowsPerPage: previousFetchParams.current?.pageSize || INITIAL_TABLE_PAGE_SIZE,
    onPageChange,
    onPageSizeChange,
    totalCount: data?.TotalCount || 0,
  };

  const sortingConfig: SortingConfig = {
    orderBy: params?.sort,
    order: params?.sortType === 'desc' ? 'desc' : 'asc',
    onSort,
  };

  return {
    data,
    error,
    pagingConfig,
    sortingConfig,
    handleExport,
    getQuery: fetch,
    refetch,
    originalArgs,
    ...rest,
  };
};

export default useServerSideQuery;
