import * as React from 'react';
import { TextField } from '@mui/material';

interface CommonTextFieldProps {
  label: string;
  type?: string;
  value: string;
  maxLength?: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | boolean;
  helperText?: string;
  disabled?: boolean;
}

const CommonTextField: React.FC<CommonTextFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  helperText,
  maxLength,
  disabled = false,
  ...props
}) => {
  return (
    <TextField
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={helperText}
      fullWidth
      margin="normal"
      variant="outlined"
      className="w-full my-4"
      disabled={disabled}
      InputLabelProps={{
        className: 'text-gray-700',
      }}
      InputProps={{
        className: 'bg-white rounded-md',
      }}
      inputProps={{
        maxLength: maxLength,
      }}
      {...props}
    />
  );
};

export default CommonTextField;
