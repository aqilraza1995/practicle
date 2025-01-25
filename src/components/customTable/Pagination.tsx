import { FC } from "react";
import {
  Box,
  IconButton,
  TableFooter,
  TablePagination,
  TableRow,
} from "@mui/material";
import {
  FirstPage,
  LastPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";

interface PaginationProps {
  colSpan: number;
  count: number;
  rowPerPage: number;
  page: number;
  onChangePage: (page: number) => void;
  handleChangeRowsPerPage?: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

interface PaginationActionProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
}

const Pagination: FC<PaginationProps> = ({
  colSpan,
  count,
  rowPerPage,
  page,
  onChangePage,
  handleChangeRowsPerPage,
}) => {
  const TablePaginationActions: React.FC<PaginationActionProps> = ({
    count,
    page,
    rowsPerPage,
    onPageChange,
  }) => {
    const handleFirstPageButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      onPageChange(event, 0);
    };

    const handleBackButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          <FirstPage />
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          <KeyboardArrowRight />
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          <LastPage />
        </IconButton>
      </Box>
    );
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    onChangePage(newPage);
    console.log("newPage:", newPage);
  };

  return (
    <>
      <TableFooter>
        <TableRow>
          <TablePagination
            rowsPerPageOptions={[2, 5, 10, 25, 50, 100]}
            colSpan={colSpan}
            align="right"
            count={count}
            rowsPerPage={rowPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={(event) => {
              if (handleChangeRowsPerPage) {
                handleChangeRowsPerPage(
                  event as React.ChangeEvent<HTMLInputElement>
                );
              }
            }}
            ActionsComponent={TablePaginationActions}
          />
        </TableRow>
      </TableFooter>
    </>
  );
};

export default Pagination;
