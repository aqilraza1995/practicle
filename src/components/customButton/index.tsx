import { Button, Tooltip } from "@mui/material";
import { FC } from "react";

interface CustomButtonProps {
  text?: string;
  variant?: "contained" | "outlined" | "text";
  onClick?: () => void;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  size?: "small" | "medium" | "large";
  tooltip?: string; 
  color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning"
}

const CustomButton: FC<CustomButtonProps> = ({
  text,
  variant = "contained",
  onClick,
  startIcon,
  endIcon,
  icon,
  fullWidth = false,
  size,
  tooltip,
  color,
}) => {
  const button = (
    <Button
      variant={variant}
      startIcon={startIcon}
      endIcon={endIcon}
      fullWidth={fullWidth}
      onClick={onClick}
      size={size}
      color={color}
      sx={{minWidth:"40px"}}
    >
      {text}
      {icon}
    </Button>
  );

  return tooltip ? <Tooltip title={tooltip}>{button}</Tooltip> : button;
};

export default CustomButton;