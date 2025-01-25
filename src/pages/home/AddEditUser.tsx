import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import dayjs, { Dayjs } from "dayjs";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Card,
  CardContent,
  FormHelperText,
  TextFieldProps,
} from "@mui/material";
import { AttachFileOutlined } from "@mui/icons-material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { AppDispatch, RootState } from "../../store/store";
import CustomInput from "../../components/customInput";
import {
  addUser,
  getRoles,
  getUsersById,
  updateUser,
} from "../../store/userSlice";
import CustomSelect from "../../components/customSelect";
import CustomSwitch from "../../components/customSwitch";
import CustomLoadingButton from "../../components/customLoadinButton";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string().test(
    "password-required",
    "Password is required",
    function (value) {
      const path = window.location.pathname;
      if (path.includes("add-user")) {
        return value
          ? true
          : this.createError({ message: "Password is required" });
      }

      if (path.includes("edit-user")) {
        return true;
      }
      return true;
    }
  ),
  dob: Yup.date().required("Date of birth is required"),
  role: Yup.string().required("Role is required"),
  profile: Yup.mixed().test(
    "profile-validation",
    "Please upload profile",
    (value) => {
      return (
        (Array.isArray(value) && value.length >= 1) ||
        (typeof value === "string" && value.trim().length > 0)
      );
    }
  ),
  galleries: Yup.array()
    .test("totalSize", "Total file size exceeds 4MB", (files) => {
      if (files) {
        const totalSize = files.reduce((acc: number, file) => {
          if (file instanceof File) {
            return acc + file.size;
          }
          return acc;
        }, 0);
        return totalSize <= 4 * 1024 * 1024;
      }
      return true;
    })
    .min(1, "At least one user galleries is required"),

  pictures: Yup.array()
    .test("totalSize", "Total file size exceeds 4MB", (files) => {
      if (files) {
        const totalSize = files.reduce((acc: number, file) => {
          if (file instanceof File) {
            return acc + file.size;
          }
          return acc;
        }, 0);
        return totalSize <= 4 * 1024 * 1024;
      }
      return true;
    })
    .min(1, "At least one user picture is required"),

  gender: Yup.string().required("Gender is required"),
  status: Yup.boolean().required("Status is required"),
});

const AddEditUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams();
  const [page] = useState<number>(1);
  const [perPage] = useState<number>(100);
  const [loading, setLoading] = useState<boolean>(false);
  const rolesOption = useSelector((state: RootState) => state?.user?.roles);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      dob: null as Dayjs | null,
      role: "",
      profile: [],
      galleries: [],
      pictures: [],
      gender: "",
      status: null,
    },
    validationSchema,
    // validateOnChange: false,
    // validateOnBlur: false,

    onSubmit: async (values) => {
      try {
        setLoading(true);
        const formattedValues = {
          ...values,
          dob: values.dob ? values.dob.format("YYYY-MM-DD") : "null",
          role_id: parseInt(values.role, 10),
          status: values.status ? 1 : 0,
          gender: values?.status ? 1 : 0,
        };

        let res;

        if (id) {
          res = await dispatch(
            updateUser({ userPayload: formattedValues, id: +id })
          );
          setLoading(false);
        } else {
          console.log("formattedValues :", formattedValues);
          res = await dispatch(addUser(formattedValues));
          setLoading(false);
        }
        if (res?.payload?.data) {
          navigate("/");
        }
      } catch (error) {
        console.error("Error saving user:", error);
      }
    },
  });

  // Fetch roles from store
  useEffect(() => {
    const payload: { page: number; per_page: number } = {
      page,
      per_page: perPage,
    };
    dispatch(getRoles(payload));
    if (id) {
      // Fetch user details when editing
      const getUserDetails = async () => {
        const res = await dispatch(getUsersById(+id)).unwrap();
        if (id && res) {
          formik.setFieldValue("name", res?.name);
          formik.setFieldValue("email", res?.email);
          formik.setFieldValue("role", res?.role?.id);
          formik.setFieldValue("password", res?.password);
          formik.setFieldValue("dob", dayjs(res.dob));
          formik.setFieldValue(
            "gender",
            +res?.gender !== 1 ? "female" : "male"
          );
          formik.setFieldValue("status", +res?.status === 1 ? true : false);
          formik.setFieldValue("profile", res?.profile);
          formik.setFieldValue("galleries", res?.user_galleries);
          formik.setFieldValue("pictures", res?.user_pictures);
        }
      };
      getUserDetails();
    }
  }, [dispatch, page, perPage, id]);

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue("gender", e.target.value);
    formik.setFieldError("gender", "");
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue("status", e.target.checked);
    formik.setFieldError("status", "");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#f7fafc",
          p: 0,
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: "900px",
            borderRadius: "8px",
            boxShadow: 3,
            p: 4,
          }}
        >
          <CardContent>
            <Typography variant="h5" mb={4} fontWeight="bold">
              {!id ? "Add User" : "Edit User"}
            </Typography>
            <FormikProvider value={formik}>
              <form style={{ width: "100%" }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <CustomInput
                      name="name"
                      label="Name"
                      variant="outlined"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={
                        (formik.touched.name && formik.errors.name) || ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomInput
                      name="email"
                      label="Email"
                      variant="outlined"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.email && Boolean(formik.errors.email)
                      }
                      helperText={
                        (formik.touched.email && formik.errors.email) || ""
                      }
                    />
                  </Grid>
                  {!id && (
                    <Grid item xs={12} md={6}>
                      <CustomInput
                        name="password"
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.password &&
                          Boolean(formik.errors.password)
                        }
                        helperText={
                          (formik.touched.password && formik.errors.password) ||
                          ""
                        }
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} md={6}>
                    <CustomSelect
                      options={
                        (rolesOption as { [key: string]: string | number }[]) ||
                        []
                      }
                      label="Role"
                      name="role"
                      labelKey="name"
                      valueKey="id"
                      variant="outlined"
                      value={formik.values.role}
                      onChange={formik.handleChange}
                      error={formik.touched.role && Boolean(formik.errors.role)}
                      helperText={
                        (formik.touched.role && formik.errors.role) || ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <MobileDatePicker
                      label="Date of Birth"
                      inputFormat="DD/MM/YYYY"
                      maxDate={dayjs()}
                      variant="standard"
                      value={formik.values.dob}
                      sx={{
                        "&.MuiFormControl-root": {
                          width: "100%",
                        },
                      }}
                      onChange={(value) => formik.setFieldValue("dob", value)}
                      renderInput={(params: TextFieldProps) => (
                        <TextField
                          {...params}
                          InputProps={{
                            ...params.InputProps,
                            sx: {
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "red", // Change border color to red
                              },
                            },
                          }}
                        />
                      )}
                    />
                    {formik.errors.dob && (
                      <FormHelperText sx={{ color: "#d32f2f" }}>
                        {formik.errors.dob}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomInput
                      label="Profile"
                      name="profile"
                      variant="outlined"
                      icon={<AttachFileOutlined />}
                      onChange={(e) => {
                        const target = e.target as HTMLInputElement;
                        formik.setFieldValue(
                          "profile",
                          target.files ? Array.from(target.files) : []
                        );
                      }}
                      fileProps={{
                        onFileChange: (files) =>
                          formik.setFieldValue("profile", files),
                      }}
                      error={
                        formik.touched.profile && Boolean(formik.errors.profile)
                      }
                      helperText={
                        (formik.touched.profile &&
                        typeof formik.errors.profile === "string"
                          ? formik.errors.profile
                          : "") || ""
                      }
                      // helperText={
                      //   (formik.touched.profile && formik.errors.profile) || ""
                      // }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" gutterBottom>
                      Gender
                    </Typography>
                    <RadioGroup
                      row
                      name="gender"
                      value={formik.values.gender}
                      onChange={handleGenderChange}
                    >
                      <FormControlLabel
                        sx={{
                          ".MuiTypography-root": { fontSize: "13px", pb: 0 },
                          color: formik.errors.gender && "#d32f2f",
                        }}
                        value="female"
                        control={
                          <Radio
                            sx={{ color: formik.errors.gender && "#d32f2f" }}
                          />
                        }
                        label="Female"
                      />
                      <FormControlLabel
                        sx={{
                          ".MuiTypography-root": { fontSize: "13px", pb: 0 },
                          color: formik.errors.gender && "#d32f2f",
                        }}
                        value="male"
                        control={
                          <Radio
                            sx={{ color: formik.errors.gender && "#d32f2f" }}
                          />
                        }
                        label="Male"
                      />
                    </RadioGroup>
                    {formik.touched.gender && formik.errors.gender && (
                      <FormHelperText sx={{ color: "#d32f2f" }}>
                        {formik.errors.gender}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" gutterBottom>
                      Status
                    </Typography>
                    <CustomSwitch
                      checked={formik.values.status ?? false}
                      onChange={handleStatusChange}
                      helperText={formik.errors.status}
                      sx={{
                        "& .MuiSwitch-thumb": {
                          backgroundColor: formik.errors.status && "#ff5252", // Thumb color
                        },
                        "& .MuiSwitch-track": {
                          backgroundColor: formik.errors.status && "#ffc7c7", // Track color
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomInput
                      label="User Galleries"
                      name="galleries"
                      variant="outlined"
                      icon={<AttachFileOutlined />}
                      fileProps={{
                        multiple: true,
                        onFileChange: (files) =>
                          formik.setFieldValue("galleries", files),
                      }}
                      error={
                        formik.touched.galleries &&
                        Boolean(formik.errors.galleries)
                      }
                      helperText={
                        (formik.touched.galleries &&
                        typeof formik.errors.galleries === "string"
                          ? formik.errors.galleries
                          : "") || ""
                      }
                    />
                    <Typography variant="caption" mt={1}>
                      {id ? 0 : formik.values.galleries.length} / 5
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomInput
                      label="User Pictures"
                      name="pictures"
                      variant="outlined"
                      icon={<AttachFileOutlined />}
                      fileProps={{
                        multiple: true,
                        onFileChange: (files) =>
                          formik.setFieldValue("pictures", files),
                      }}
                      error={
                        formik.touched.pictures &&
                        Boolean(formik.errors.pictures)
                      }
                      helperText={
                        (formik.touched.galleries &&
                        typeof formik.errors.galleries === "string"
                          ? formik.errors.galleries
                          : "") || ""
                      }
                    />
                    <Typography variant="caption" mt={1}>
                      {id ? 0 : formik.values.pictures.length} / 5
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid item sm={4} xs={12}>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <CustomLoadingButton
                          text={id ? "Update" : "Submit"}
                          type={"submit"}
                          onClick={(e: { preventDefault: () => void }) => {
                            e.preventDefault();
                            formik.handleSubmit();
                          }}
                          isLoading={loading}
                        />

                        <CustomLoadingButton
                          text="Cancel"
                          backgroundColor="#aaaaaa"
                          hoverColor="#b1b1b1"
                          onClick={() => navigate("/")}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            </FormikProvider>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
};

export default AddEditUser;
