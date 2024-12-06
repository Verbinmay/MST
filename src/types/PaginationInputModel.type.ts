export type PaginationInputModel = {
  searchNameTerm: null | string | string[];
  sortBy: string;
  sortDirection: "asc" | "desc";
  pageNumber: number;
  pageSize: number;
};
