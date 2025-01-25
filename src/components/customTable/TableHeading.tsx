import React from "react";
import {
  Checkbox,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";

interface Column {
  id: string;
  label: string;
  numeric?: boolean;
  sort?: boolean;
  visible: boolean;
}

interface TableHeadingProps {
  columns: Column[];
  onSelectAllClick?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order?: "asc" | "desc";
  orderBy?: string;
  numSelected?: number;
  rowCount?: number;
  onRequestSort?: (property: string) => void;
  multiSelect?: boolean;
}

const TableHeading: React.FC<TableHeadingProps> = ({
  columns,
  onSelectAllClick,
  order,
  orderBy,
  numSelected = 0,
  rowCount = 0,
  onRequestSort = () => {},
  multiSelect,
}) => {
  const onSortOrderChange = (property: string) => () => {
    onRequestSort(property); 
  };

  return (
    <TableHead sx={{ background: "#007190" }}>
      <TableRow>
        {multiSelect && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ "aria-label": "select all rows" }}
            sx={{
                color: "white", 
                "&.Mui-checked": { color: "white" }, 
                "&.MuiCheckbox-indeterminate": { color: "white" }, 
                "&:hover": { color: "white" },
              }}
            />
          </TableCell>
        )}
        {columns &&
          columns.map(
            (headCell, index) =>
              headCell.visible && (
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: "16px",
                  }}
                  key={index}
                  align={headCell.numeric ? "right" : "left"}
                  padding="normal"
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  {headCell.sort === false ? (
                    headCell.label
                  ) : (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={onSortOrderChange(headCell.id)}
                      sx={{
                        color: "white",
                        "&.Mui-active": {
                          color: "white",
                        },
                        "&:hover": {
                          color: "white",
                        },
                        "& .MuiTableSortLabel-icon": {
                          color: "white !important",
                        },
                        "&:hover .MuiTableSortLabel-icon": {
                          color: "white !important",
                        },
                      }}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  )}
                </TableCell>
              )
          )}
      </TableRow>
    </TableHead>
  );
};

export default TableHeading;