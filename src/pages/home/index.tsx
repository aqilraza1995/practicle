import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Paper,
  SelectChangeEvent,
  Toolbar,
  Typography,
} from "@mui/material";

import { AppDispatch, RootState } from "../../store/store";
import { logout } from "../../store/authSlice";
import {
  exportUser,
  getRoles,
  getUsers,
  getUsersById,
  multiDelete,
  removeUser,
} from "../../store/userSlice";
import CustomTable from "../../components/customTable";
import CustomInput from "../../components/customInput";
import {
  Add,
  ArrowDownward,
  Delete,
  Edit,
  FilterAlt,
  Search,
  Visibility,
} from "@mui/icons-material";
import CustomButton from "../../components/customButton";
import CustomModal from "../../components/customModal";
import CustomSelect from "../../components/customSelect";

interface Row {
  id: number;
  role: Role;
  [key: string]: unknown;
}

interface UserDetailsProps {
  name?: string;
  email?: string;
  role?: string;
  dob?: string;
  gender?: string;
  status?: string;
}

interface Role {
  name: string;
}

interface Column {
  id: string;
  label: string;
  visible: boolean;
  sort?: boolean;
  render?: (row: Row) => React.ReactNode;
}

interface FilterColumnState {
  columns: Column[];
}

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state?.user?.list);
  const rolesOption = useSelector((state: RootState) => state?.user?.roles);

  const authUser =
    localStorage.getItem("authUser") !== null
      ? JSON.parse(localStorage.getItem("authUser") || "")
      : null;

  const columns: Column[] = [
    { id: "name", label: "Name", visible: true, sort: true },
    { id: "email", label: "Email", visible: true },
    {
      id: "role",
      label: "Role",
      visible: true,
      render: (elm: Row) => elm?.role?.name,
    },
    { id: "dob", label: "DOB", visible: true },
    { id: "gender_text", label: "Gender", visible: true },
    { id: "status_text", label: "Status", visible: true },
    {
      id: "action",
      label: "Actions",
      visible: true,
      sort: false,
      render: (elm) => (
        <>
          <CustomButton
            icon={<Visibility />}
            variant="text"
            onClick={() => handleView(elm.id)}
          />
          <CustomButton
            icon={<Edit />}
            variant="text"
            onClick={() => navigate(`/edit-user/${elm?.id}`)}
          />
          <CustomButton
            icon={<Delete />}
            variant="text"
            color="error"
            onClick={() => handleOpenDeleteModal(elm?.id)}
          />
        </>
      ),
    },
  ];

  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [refresh, setRefresh] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [openVisibleColumnModal, setOpenVisibleColumnModal] =
    useState<boolean>(false);
  const [openRoleFilterModal, setOpenRoleFilterModal] =
    useState<boolean>(false);
  const [applyFilter, setApplyFilter] = useState<string | number>();
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const [id, setId] = useState<number | string>("");

  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("");
  const [selectedRowsIds, setSelectedRowsIds] = useState<number[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetailsProps | null>(null);
  const [filterColumn, setFilterColumn] = useState<FilterColumnState>();
  const [roleId, setRoleId] = useState<string | number>();

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedRowsIds((prevSelected) =>
      prevSelected.includes(+id)
        ? prevSelected.filter((rowId) => +rowId !== +id)
        : [...prevSelected, +id]
    );
  };

  const handleCheckAll = () => {
    if (selectedRowsIds?.length) {
      setSelectedRowsIds([]);
    } else {
      const ids: number[] = userData?.data?.length
        ? userData?.data?.map((item) => Number(item?.id))
        : [];
      setSelectedRowsIds(ids);
    }
  };

  const handleLogout = async () => {
    const resultAction = await dispatch(logout());
    if (logout.fulfilled.match(resultAction)) {
      navigate("/login");
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = parseInt(event.target.value, 10);
    setPerPage(value);
    setPage(1);
  };

  const handleMultipleDelete = async () => {
    const resultAction = await dispatch(multiDelete(selectedRowsIds));
    if (multiDelete.fulfilled.match(resultAction)) {
      setRefresh(!refresh);
      setSelectedRowsIds([]);
    }
  };

  const handleView = async (id: number) => {
    setOpen(true);
    const resultAction = await dispatch(getUsersById(id)).unwrap();
    setUserDetails({
      name: resultAction?.name,
      email: resultAction?.email,
      role: resultAction?.role?.name,
      dob: resultAction?.dob,
      gender: resultAction?.gender_text,
      status: resultAction?.status_text,
    });
  };

  const handleCloseViewModal = () => {
    setOpen(false);
    setUserDetails(null);
  };

  const handleExportData = () => {
    dispatch(exportUser());
  };

  const handleVisible = (key: string) => {
    if (!filterColumn) return;
    setFilterColumn({
      ...filterColumn,
      columns: filterColumn.columns.map((column) =>
        column.id === key ? { ...column, visible: !column.visible } : column
      ),
    });
  };

  const handleOpenRoleModal = () => {
    setOpenRoleFilterModal(true);
    const payload: { page: number; per_page: number } = {
      page,
      per_page: perPage,
    };
    dispatch(getRoles(payload));
  };

  const handleRoleChange = (evt: SelectChangeEvent<string | number>) => {
    setRoleId(evt.target.value);
  };

  const handleFilter = () => {
    const key = {role_id:[`${roleId}`]}
    const keyString = JSON.stringify(key)
    const base64Key = btoa(keyString)
    setApplyFilter(base64Key);
    setOpenRoleFilterModal(false);
  };

  const handleResetFilter = () => {
    setRoleId("");
    setApplyFilter("");
    setOpenRoleFilterModal(false);
  };

  const handleOpenDeleteModal = (dataId: number) => {
    setId(dataId);
    setOpenConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    await dispatch(removeUser(+id));  
    setId(""); 
    setOpenConfirmModal(false); 
  };

  useEffect(() => {
    setFilterColumn({ columns });
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setTableLoader(true);
    const getData = async () => {
      const payload: {
        page: number;
        per_page: number;
        [key: string]: unknown;
      } = {
        page,
        per_page: perPage,
      };
      if (debouncedSearch) {
        payload.search = debouncedSearch;
      }
      if (applyFilter) {
        payload.filter = applyFilter;
      }
      if (orderBy) {
        payload.sort = orderBy;
        payload.order_by = order;
      }

      await dispatch(getUsers(payload));
      setTableLoader(false);
    };
    getData();
  }, [
    dispatch,
    page,
    perPage,
    debouncedSearch,
    order,
    orderBy,
    refresh,
    applyFilter,
  ]);

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#512da8" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" component="div">
            Hi {authUser?.name}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ margin: "28px 28px 28px 25px", background: "#d5e7ec" }}>
        <Paper sx={{ borderRadius: "10px", padding: "30px" }}>
          <Grid container mb={3} display="flex" justifyContent="space-between">
            <Grid item md={3} sm={4} xs={12}>
              <CustomInput
                label="Search"
                icon={<Search />}
                name="search"
                onChange={handleSearchChange}
              />
            </Grid>
            <Grid
              item
              md={3}
              sm={4}
              xs={12}
              display="flex"
              alignItems="end"
              justifyContent="end"
              gap={1}
            >
              <CustomButton
                icon={<FilterAlt />}
                tooltip="filter"
                onClick={handleOpenRoleModal}
              />
              <CustomButton
                icon={<Add />}
                tooltip="Add"
                onClick={() => navigate("/add-user")}
              />
              <CustomButton
                icon={<ArrowDownward />}
                tooltip="Export"
                variant="text"
                onClick={handleExportData}
              />
              <CustomButton
                icon={<Visibility />}
                tooltip="Columns Visibility"
                onClick={() => setOpenVisibleColumnModal(true)}
              />
              {selectedRowsIds?.length ? (
                <CustomButton
                  icon={<Delete />}
                  tooltip="Multiple Delete"
                  variant="text"
                  onClick={handleMultipleDelete}
                />
              ) : null}
            </Grid>
          </Grid>
          <CustomTable
            columns={filterColumn?.columns || []}
            rows={(userData?.data as Row[]) || []}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            multiSelect={true}
            handleCheckboxChange={handleCheckboxChange}
            selectedRows={selectedRowsIds}
            onSelectAllClick={handleCheckAll}
            count={userData?.total || 0}
            page={page}
            rowPerPage={perPage}
            onChangePage={handlePageChange}
            handleChangeRowsPerPage={handleRowsPerPageChange}
            loading={tableLoader}
          />
        </Paper>
      </Box>

      {/* ----------- View user detail Modal -------------- */}

      <CustomModal
        open={open}
        handleClose={handleCloseViewModal}
        maxWidth="md"
        title="VIEW USER"
        closeIcon
      >
        {!userDetails ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box mt={5}>
            <Grid container spacing={2} display="flex" justifyContent="center">
              {Object.entries(userDetails)?.map(([key, value], index) => (
                <React.Fragment key={key}>
                  <Grid
                    item
                    xs={4}
                    sm={3}
                    sx={{
                      mr: "3px",
                      display: "flex",
                      alignItems: "center",
                      pt: "5px !important",
                      backgroundColor: index % 2 === 0 ? "#f5f5f5" : "white",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: "bold",
                        p: 1,
                        textTransform: "capitalize",
                      }}
                    >
                      {key}:
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={7}
                    sm={8}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      pt: "5px !important",
                      backgroundColor: index % 2 === 0 ? "#f5f5f5" : "white",
                    }}
                  >
                    <Typography p={1} variant="subtitle2">
                      {value}
                    </Typography>
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          </Box>
        )}
      </CustomModal>

      {/* ----------- Column filter Modal -------------- */}

      <CustomModal
        open={openVisibleColumnModal}
        title="Column filter"
        closeIcon
        handleClose={() => setOpenVisibleColumnModal(false)}
      >
        <Box mt={2}>
          {filterColumn?.columns?.map((item, index) => {
            return (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={item?.visible}
                    disabled={index === 0 ? true : false}
                    onChange={() => {
                      handleVisible(item?.id);
                    }}
                    value={item?.id}
                    color="primary"
                  />
                }
                label={item?.label}
              />
            );
          })}
        </Box>
      </CustomModal>

      {/* ----------- Role filter Modal -------------- */}

      <CustomModal
        open={openRoleFilterModal}
        title="Role filter"
        closeIcon
        handleClose={() => setOpenRoleFilterModal(false)}
      >
        <Box mt={2}>
          <CustomSelect
            options={
              (rolesOption as { [key: string]: string | number }[]) || []
            }
            labelKey="name"
            valueKey="id"
            label="Roles"
            name="role"
            value={roleId ?? ""}
            onChange={handleRoleChange}
          />
        </Box>
        <Box sx={{ mt: 2, display: "flex" }}>
          <Box sx={{ mr: 1 }}>
            <CustomButton text="Apply Filter" onClick={handleFilter} />
          </Box>
          <CustomButton
            color="inherit"
            text="Reset Filter"
            onClick={handleResetFilter}
          />
        </Box>
      </CustomModal>

      {/* ----------- Delete Confirm Modal -------------- */}

      <CustomModal
        open={openConfirmModal}
        title="Confirm Delete"
        maxWidth="xs"
        handleClose={() => setOpenConfirmModal(false)}
      >
        <Box mt={2} sx={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="body2">
            {" "}
            Are you sure, You want to delete this user?
          </Typography>
        </Box>
        <Box sx={{ mt: 2, display: "flex" }}>
          <Box sx={{ mr: 1 }}>
            <CustomButton text="Delete" onClick={handleConfirmDelete} />
          </Box>
          <CustomButton
            color="inherit"
            text="Close"
            onClick={() => setOpenConfirmModal(false)}
          />
        </Box>
      </CustomModal>
    </>
  );
};

export default Home;
