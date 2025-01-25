import React from "react";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

interface CustomSelectProps {
  name: string;
  value?: string | number;
  onChange: (event: SelectChangeEvent<string | number>) => void;
  label: string;
  options: { [key: string]: string | number}[];
  labelKey: string;
  valueKey: string;
  variant?:"filled" | "outlined" | "standard"
  helperText?:string;
  error?:boolean
} 

const CustomSelect: React.FC<CustomSelectProps> = ({
  name,
  value,
  onChange,
  label,
  options=[],
  labelKey,
  valueKey,
  variant="outlined",
  helperText,
  error
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label" sx={{color: helperText && "#d32f2f"}}>{label}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        label={label}
        onChange={onChange}
        name={name}
        error={error}
        variant={variant}
      >

{options.length ? (
          (options || []).map((item, index) => (
            <MenuItem key={index} value={item[valueKey]}>
              {item[labelKey]}
            </MenuItem>
          ))
        ) : (
          <MenuItem value="">No record found</MenuItem>
        )}
      </Select>
     {helperText && <FormHelperText sx={{color:"#d32f2f"}}>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default CustomSelect;
