import React from 'react'
import MaterialTable from 'material-table'

const DefaultTable = props => {
  const { options, ...restProps } = props
  return (
    <div style={{ maxWidth: '100%' }}>
      <MaterialTable
        localization={{
          pagination: {
            labelDisplayedRows: '{from}-{to} de {count}',
            labelRowsSelect: 'filas',
          },
          toolbar: {
            nRowsSelected: '{0} filas(s) seleccionadas',
            searchTooltip: 'Buscar',
            searchPlaceholder: 'Buscar',
          },
          header: {
            actions: 'Acciones',
          },
          body: {
            emptyDataSourceMessage: 'No hay nada todavía.',
            filterRow: {
              filterTooltip: 'Filtrar',
            },
          },
        }}
        options={{
          pageSize: 10,
          pageSizeOptions: [5, 10, 20, 50, 100],
          actionsColumnIndex: restProps.columns.length,
          ...options,
        }}
        {...restProps}
      />
    </div>
  )
}

export { DefaultTable }
