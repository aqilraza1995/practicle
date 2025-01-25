import React from "react";
import { Button, CircularProgress } from "@mui/material";

interface LoadingButtonProps {
  isLoading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  text: string;
  variant?: "text" | "outlined" | "contained";
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  type?: "button"|"submit";
  backgroundColor?: string;
  hoverColor?:string;
}

const CustomLoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  onClick,
  text,
  variant = "contained",
  backgroundColor = "#007190",
  hoverColor="#3d93ab",
  type="button"
}) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={isLoading} 
      type={type}
      startIcon={
        isLoading ? <CircularProgress size={24} color="primary" /> : null
      } 
      fullWidth
      sx={{
        mt: 3,
        mb: 2,
        textTransform: "none",
        backgroundColor: backgroundColor,
        "&:hover": {
          backgroundColor: hoverColor,
        },
        "&:focus": {
          outline: "none", 
        },
      }}
    >
      {isLoading ? null : text} 
    </Button>
  );
};

export default CustomLoadingButton;
