import React from 'react'
import PropTypes from 'prop-types'

export default function Table({ columns, data, onRowClick, className, emptyMessage }) {
  return (
    <div className={className}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {columns.map((col) => (
                <th key={col.key || col.accessor} className="text-left py-3 px-4 font-semibold text-slate-700">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {(!data || data.length === 0) ? (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center text-slate-600">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={row.id ?? rowIndex}
                  className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((col) => (
                    <td key={col.key || col.accessor} className="py-3 px-4 align-top">
                      {typeof col.render === 'function' ? col.render(row) : String(row[col.accessor] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    header: PropTypes.node.isRequired,
    accessor: PropTypes.string,
    key: PropTypes.string,
    render: PropTypes.func,
  })).isRequired,
  data: PropTypes.array,
  onRowClick: PropTypes.func,
  className: PropTypes.string,
  emptyMessage: PropTypes.node,
}

Table.defaultProps = {
  data: [],
  onRowClick: null,
  className: '',
  emptyMessage: 'No rows to display',
}
