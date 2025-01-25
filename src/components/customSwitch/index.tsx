import React from "react";
import { styled } from "@mui/material/styles";
import Switch, { SwitchProps } from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FormHelperText } from "@mui/material";

const StyledSwitch = styled(Switch)(() => ({
  width: 40,
  height: 24,
  padding: 0,
  display: "flex",
  "&:active .MuiSwitch-thumb": {
    width: 20,
  },
  "& .MuiSwitch-switchBase": {
    padding: 3,
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#1890ff",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    width: 18,
    height: 18,
    borderRadius: 9,
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
  },
  "& .MuiSwitch-track": {
    borderRadius: 12,
    opacity: 1,
    backgroundColor: "rgba(0,0,0,.25)",
  },
}));

interface CustomSwitchProps extends SwitchProps {
  helperText?: string;
}

export const CustomSwitch: React.FC<CustomSwitchProps> = ({
  helperText,
  checked,
  onChange,
  ...props
}) => {
  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        <StyledSwitch
          checked={checked}
          onChange={onChange}
          inputProps={{ "aria-label": "custom switch" }}
          {...props}
        />
        <Typography
          sx={{
            fontSize: "13px",
            color: helperText ? "#d32f2f" : "inherit",
          }}
        >
          {checked ? "Inactive" : "Active"}
        </Typography>
      </Stack>
      {helperText && (
        <FormHelperText sx={{ color: "#d32f2f" }}>{helperText}</FormHelperText>
      )}
    </>
  );
};

export default CustomSwitch;