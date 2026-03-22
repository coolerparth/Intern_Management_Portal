import Loader from "./Loader";

const Table = ({ columns, data, onRowClick, loading = false }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              {columns.map((column, idx) => (
                <th key={idx} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {column.header}
                  {column.sortable && (
                    <span className="ml-1">↑↓</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader size="lg" />
                    <span>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr 
                  key={idx}
                  className="hover:bg-gray-50 transition-colors cursor-pointer group"
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column, cidx) => (
                    <td key={cidx} className="px-6 py-4 whitespace-nowrap">
                      {column.render ? column.render(row[column.accessor]) : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;

