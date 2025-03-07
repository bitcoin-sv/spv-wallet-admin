export const DEFAULT_PAGE_INDEX = 0;
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_API_PAGE = 1; // API pages often start at 1 instead of 0

export const DEFAULT_PAGINATION = {
  pageIndex: DEFAULT_PAGE_INDEX,
  pageSize: DEFAULT_PAGE_SIZE,
};

// Utility functions for pagination conversion
export const convertToApiPage = (uiPage: number): number => uiPage + 1;
export const convertFromApiPage = (apiPage: number): number => apiPage - 1;

// Interface for API pagination response
export interface ApiPaginationResponse {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}
