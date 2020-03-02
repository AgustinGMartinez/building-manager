import React from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CircularProgress from '@material-ui/core/CircularProgress'
import Checkbox from '@material-ui/core/Checkbox'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />

const AsyncAutocomplete = ({
  request,
  textFieldProps,
  onChange,
  rememberOptions = false,
  width,
  multiple,
  getOptionLabel,
  enableSelectAll,
  ...restProps
}) => {
  const [open, setOpen] = React.useState(false)
  const [options, setOptions] = React.useState([])
  const [allSelected, setAllSelected] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (open && options.length === 0) {
      setIsLoading(true)
    }
  }, [open, options.length])

  React.useEffect(() => {
    let active = true

    if (!isLoading) {
      return undefined
    }

    try {
      ;(async () => {
        const response = await fetch(request.url, request.options)

        // if still mounted
        if (active) {
          setOptions(response)
          setIsLoading(false)
        }
      })()
    } catch (err) {
      setIsLoading(false)
    }

    return () => {
      active = false
    }
    // eslint-disable-next-line
  }, [isLoading])

  // reset options when menu is closed
  React.useEffect(() => {
    if (!open && !rememberOptions) {
      setOptions([])
    }
    // eslint-disable-next-line
  }, [open])

  return (
    <Autocomplete
      noOptionsText="Nada que cargar."
      onChange={(_, values) => {
        if (!multiple) return onChange(values)
        const newAllSelected = values.includes('all')
        onChange(newAllSelected ? options : values)
        setAllSelected(newAllSelected)
      }}
      style={{ width }}
      open={open}
      onOpen={() => {
        setOpen(true)
      }}
      onClose={() => {
        setOpen(false)
      }}
      multiple={multiple}
      getOptionLabel={getOptionLabel}
      {...restProps}
      disableCloseOnSelect={multiple}
      options={enableSelectAll ? ['all', ...options] : options}
      loading={isLoading}
      loadingText="Cargando..."
      renderInput={params => {
        return (
          <TextField
            {...params}
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
            {...textFieldProps}
          />
        )
      }}
      renderOption={
        multiple
          ? (option, { selected }) => (
              <React.Fragment>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={allSelected || selected}
                />
                {option === 'all' ? 'Seleccionar todos' : getOptionLabel(option)}
              </React.Fragment>
            )
          : undefined
      }
      renderTags={enableSelectAll && allSelected ? () => 'Todos' : undefined}
    />
  )
}

export { AsyncAutocomplete }
