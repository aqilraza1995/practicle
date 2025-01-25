import { InputAdornment, TextField, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { FC, useState, useRef } from "react";

interface InputProps {
  variant?: "outlined" | "filled" | "standard";
  name?: string;
  label: string;
  size?: "small" | "medium";
  helperText?: string;
  error?: boolean;
  fullWidth?: boolean;
  type?: string;
  required?: boolean;
  margin?: "dense" | "none" | "normal";
  value?: string;
  onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (evt: React.FocusEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
  fileProps?: {
    accept?: string;
    multiple?: boolean;
    onFileChange?: (files: File[] | null) => void;
  };
}

const CustomInput: FC<InputProps> = ({
  variant = "standard",
  name,
  onChange,
  label,
  size,
  helperText,
  fullWidth = true,
  type,
  required = false,
  margin,
  value,
  onBlur,
  icon,
  iconPosition = "start",
  fileProps,
  error,
}) => {
  const [selectedFileLabel, setSelectedFileLabel] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    if (fileProps) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
  
    if (files) {
      const fileArray = Array.from(files);
  
      if (fileProps?.onFileChange) {
        fileProps.onFileChange(fileArray);
      }
  
      if (fileArray.length === 1) {
        setSelectedFileLabel(fileArray[0].name);
      } else {
        setSelectedFileLabel(`${fileArray.length} files selected`);
      }
    }
  
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <TextField
        id={name}
        name={name}
        label={required ? `${label}*` : label}
        variant={variant}
        onChange={onChange}
        onBlur={onBlur}
        size={size}
        error={error}
        helperText={helperText}
        fullWidth={fullWidth}
        type={type === "password" && !showPassword ? "password" : "text"}
        margin={margin}
        value={selectedFileLabel || value}
        onClick={fileProps ? handleFileClick : undefined}
        InputProps={{
          startAdornment: icon ? (
            <InputAdornment position={iconPosition}>{icon}</InputAdornment>
          ) : null,
          endAdornment: type === "password" ? (
            <InputAdornment position="end">
              <IconButton onClick={togglePasswordVisibility} edge="end" sx={{
                  "&:focus": {
                    outline: "none",
                  },
                }}>
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
      {fileProps && (
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          accept={fileProps.accept}
          multiple={fileProps.multiple}
          onChange={handleFileChange}
        />
      )}
    </>
  );
};

export default CustomInput;
