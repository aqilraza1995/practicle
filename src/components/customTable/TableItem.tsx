import React from "react";
import {
  Checkbox,
  CircularProgress,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";

interface Column {
  visible: boolean;
  id: string;
  label: string;
  render?: (data: unknown, index: number) => React.ReactNode;
}

interface Row {
  id: number;
  [key: string]: unknown;
}

interface TableItemProps {
  rows: Row[];
  columns: Column[];
  multiSelect?: boolean;
  handleCheckboxChange?: (rowId: number) => void;
  selectedRows?: number[];
  loading?: boolean;
}

const TableItem: React.FC<TableItemProps> = ({
  rows,
  columns,
  multiSelect = false,
  handleCheckboxChange,
  selectedRows,
  loading,
}) => {
  return (
    <TableBody>
      {loading ? (
        <TableRow>
          <TableCell colSpan={columns.length} align="center">
            <CircularProgress />
          </TableCell>
        </TableRow>
      ) : !rows?.length ? (
        <TableRow>
          <TableCell colSpan={columns.length} align="center">
            No Data Found
          </TableCell>
        </TableRow>
      ) : (
        rows.map((data, index) => {
          const isItemSelected =
            selectedRows?.length && selectedRows.includes(+data?.id);
          return (
            <TableRow
              hover
              tabIndex={-1}
              key={index}
              sx={{
                cursor: "pointer",
                "&:nth-of-type(odd)": {
                  backgroundColor: " #f5f5f5;",
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                },
                "&:nth-of-type(even)": {
                  backgroundColor: "transparent",
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                },
              }}
            >
              {multiSelect && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={!!isItemSelected}
                    onChange={() => handleCheckboxChange?.(data.id)}
                  />
                </TableCell>
              )}
              {columns.map((cell, i) => {
                if (cell?.visible) {
                  return (
                    <TableCell key={i}>
                      {cell.render
                        ? cell.render(data, index)
                        : String(data[cell.id] ?? "")}
                    </TableCell>
                  );
                }
                return null;
              })}
            </TableRow>
          );
        })
      )}
    </TableBody>
  );
};

export default TableItem;
