import { Autocomplete, TextField } from '@mui/material'

export interface optionSelectProps {
  id: string
  name: string
  active?: boolean
  ip?: string
}

interface FormComponentsProps {
  optionSelect: optionSelectProps[]
  label: string
  error: { message: string } | undefined
  onChange: (
    event: React.SyntheticEvent,
    newValue: optionSelectProps | null,
  ) => void
  value: optionSelectProps | null
  noOptionText: string
  placeholder?: string
  disabled?: boolean
}
export default function AutoComplete({
  optionSelect = [],
  onChange,
  label,
  error,
  value,
  placeholder,
  noOptionText,
  disabled,
}: FormComponentsProps) {

  return (
    <Autocomplete
      options={optionSelect}
      noOptionsText={noOptionText}
      disabled={disabled}
      value={value}
      sx={{
        width: '100%',
        maxWidth: {
          xs: '100%',
          md: '100%',
          lg: '23.125rem',
        },
      }}
      getOptionLabel={(option) => option.name}
      getOptionDisabled={(option) => !option.active || false}
      onChange={onChange}
      renderInput={(params) => (
        <TextField
          {...params}
          error={!!error}
          disabled={disabled}
          helperText={error?.message}
          label={label}
          placeholder={placeholder}
        />
      )}
    />
  )
}
