import React from "react";
import PropTypes from "prop-types";

export default function Table({
  columns,
  data,
  onRowClick,
  className,
  emptyMessage,
}) {
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div className={className}>
      {/* Responsive scroll wrapper */}
      <div className="overflow-x-auto w-full">
        <table
          className="
            w-full text-sm 
            min-w-[600px]         
            sm:min-w-full
          "
        >
          {/* Header */}
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {columns.map((col, colIndex) => (
                <th
                  key={col.key || col.accessor || colIndex}
                  className="
                    text-left py-3 px-4 
                    font-semibold text-slate-700 
                    whitespace-nowrap
                  "
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {!hasData ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-10 text-center text-slate-600 text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const rowKey = row.id ?? index;

                return (
                  <tr
                    key={rowKey}
                    className="
                      border-b border-slate-100 
                      hover:bg-slate-50 
                      cursor-pointer 
                      transition
                    "
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((col, colIndex) => {
                      const cellKey = col.key || col.accessor || colIndex;

                      const value = col.render
                        ? col.render(row)
                        : row[col.accessor] ?? "";

                      return (
                        <td
                          key={`${rowKey}-${cellKey}`}
                          className="
                            py-3 px-4 
                            align-top 
                            break-words 
                            max-w-[200px] 
                            sm:max-w-none
                          "
                        >
                          {value}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.node.isRequired,
      accessor: PropTypes.string,
      key: PropTypes.string,
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.array,
  onRowClick: PropTypes.func,
  className: PropTypes.string,
  emptyMessage: PropTypes.node,
};

Table.defaultProps = {
  data: [],
  className: "",
  onRowClick: null,
  emptyMessage: "No rows to display",
};
