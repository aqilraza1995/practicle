import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { FormikProvider, useFormik } from "formik";
import { Box, Grid, Typography } from "@mui/material";

import CustomInput from "../../components/customInput";
import { login } from "../../store/authSlice";
import { AppDispatch, RootState } from "../../store/store";
import CustomLoadingButton from "../../components/customLoadinButton";

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state?.auth);
  const navigate = useNavigate();
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,

    onSubmit: async (values) => {
      try {
        const resultAction = await dispatch(login(values));
        if (login.fulfilled.match(resultAction)) {
          navigate("/");
        }
      } catch (error) {
        console.error("Unexpected error during login", error);
      }
    },
  });

  return (
    <>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={4}
          sx={{
            backgroundImage: "url('/bg-4.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#512da8",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "baseline",
            textAlign: "left",
            padding: "32px",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: "bold",
              fontSize: { lg: "42px", md: "32px", xs: "26px" },
            }}
          >
            EASTERN
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mt: { lg: 0, xs: 5 },
              fontSize: { lg: "20px", md: "18px", xs: "16px" },
            }}
          >
            Welcome to Eastern Techno Solutions!
          </Typography>
          <Box sx={{ display: { xs: "none", lg: "flex" } }}>
            <Typography variant="body2">
              © 2025 Eastern Techno Solutions
            </Typography>
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          lg={8}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              component="h1"
              variant="h5"
              sx={{ fontWeight: "bold", color: "black" }}
            >
              Sign In
            </Typography>
            <Typography
              variant="body2"
              sx={{ mt: 1, mb: 4, color: "#8daab3", textAlign: "left" }}
            >
              Enter your username and password
            </Typography>
            {auth.error && (
              <Box
                component="section"
                sx={{
                  width: "100%",
                  p: 1,
                  border: "1px solid red",
                  borderRadius: "6px",
                  textAlign: "center",
                }}
              >
                <Typography variant="subtitle2" color="error">
                  {auth.error}
                </Typography>
              </Box>
            )}
            <FormikProvider value={formik}>
              <form style={{ width: "100%" }}>
                <CustomInput
                  name="email"
                  label="Email"
                  type="email"
                  required
                  value={formik.values.email}
                  margin="normal"
                  onChange={(e) => {
                    formik.validateField("email");
                    formik.handleChange(e);
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={
                    (formik.touched.email && formik.errors.email) || ""
                  }
                />

                <CustomInput
                  name="password"
                  label="Password"
                  type="password"
                  required
                  margin="normal"
                  value={formik.values.password}
                  onChange={(e) => {
                    formik.validateField("password");
                    formik.handleChange(e);
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={
                    (formik.touched.password && formik.errors.password) || ""
                  }
                />

                <Typography
                  mt={2}
                  variant="body2"
                  color="primary"
                  display="flex"
                  justifyContent="end"
                >
                  <span style={{ cursor: "pointer" }}>Forgot Password?</span>
                </Typography>

                <CustomLoadingButton
                  text="Submit"
                  isLoading={auth?.loading}
                  type={"submit"}
                  onClick={(e: { preventDefault: () => void; }) => {
                    e.preventDefault(); 
                    formik.handleSubmit(); 
                  }}
                />
              </form>
            </FormikProvider>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
