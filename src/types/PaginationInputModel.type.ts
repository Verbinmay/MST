export type PaginationInputModel = {
  searchNameTerm?: null | string | string[];
  searchLoginTerm?: null | string | string[];
  searchEmailTerm?: null | string | string[];
  sortBy: string;
  sortDirection: "asc" | "desc";
  pageNumber: number;
  pageSize: number;
};
