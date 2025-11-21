import { useState } from "react";

export const usePagination = (data: unknown[], itemsPerPage = 24) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginated = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return { currentPage, setCurrentPage, totalPages, paginated };
};
