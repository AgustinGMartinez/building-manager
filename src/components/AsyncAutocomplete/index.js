import React from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CircularProgress from '@material-ui/core/CircularProgress'
import Checkbox from '@material-ui/core/Checkbox'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'

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
  const isLoading = open && options.length === 0

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
  const checkedIcon = <CheckBoxIcon fontSize="small" />

  React.useEffect(() => {
    let active = true

    if (!isLoading) {
      return undefined
    }

    ;(async () => {
      const response = await fetch(request.url, request.options)

      if (active) {
        setOptions(response)
      }
    })()

    return () => {
      active = false
    }
    // eslint-disable-next-line
  }, [isLoading])

  React.useEffect(() => {
    if (!open && !rememberOptions) {
      setOptions([])
    }
    // eslint-disable-next-line
  }, [open])

  return (
    <Autocomplete
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
