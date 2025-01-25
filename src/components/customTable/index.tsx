import { FC } from "react";
import { Box, Paper, Table, TableContainer } from "@mui/material";

import TableHeading from "./TableHeading";
import TableItem from "./TableItem";
import Pagination from "./Pagination";

interface Column {
  id: string;
  label: string;
  numeric?: boolean;
  sort?: boolean;
  visible: boolean;
}

interface Row {
  id: number;
  [key: string]: unknown;
}

interface TableProps {
  rows: Row[];
  columns: Column[];
  onSelectAllClick?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order?: "asc" | "desc";
  orderBy?: string;
  onRequestSort?: (property: string) => void;
  multiSelect?: boolean;
  handleCheckboxChange?: (rowId: number) => void;
  selectedRows?: number[];
  count?: number;
  page?: number;
  rowPerPage?: number;
  loading?:boolean;
  onChangePage: (page: number) => void;
  handleChangeRowsPerPage?: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

const CustomTable: FC<TableProps> = ({
  columns,
  rows,
  orderBy,
  order,
  multiSelect = false,
  onRequestSort,
  handleCheckboxChange,
  onSelectAllClick,
  selectedRows,
  count = 0,
  page = 0,
  rowPerPage = 10,
  onChangePage,
  handleChangeRowsPerPage,
  loading
}) => {
  return (
    <Box sx={{ width: "100%" }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHeading
            columns={columns}
            order={order}
            orderBy={orderBy}
            onRequestSort={onRequestSort}
            multiSelect={multiSelect}
            rowCount={rows?.length}
            numSelected={selectedRows?.length}
            onSelectAllClick={onSelectAllClick}
          />
          <TableItem
            columns={columns}
            rows={rows}
            multiSelect={multiSelect}
            handleCheckboxChange={handleCheckboxChange}
            selectedRows={selectedRows}
            loading={loading}
          />

          {+count ? (
            <Pagination
              count={count}
              colSpan={columns?.length + 1}
              rowPerPage={rowPerPage}
              page={page - 1}
              onChangePage={onChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
          ) : null}
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CustomTable;
