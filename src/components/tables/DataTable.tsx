import React, { useState } from 'react';

interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  filterable?: boolean;
  filterKey?: keyof T;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
}

export function DataTable<T>({ columns, data, searchPlaceholder = 'Cari...', searchKey }: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const filteredData = data.filter(row => {
    if (!searchTerm || !searchKey) return true;
    const val = row[searchKey];
    return String(val).toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {searchKey && (
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <span className="text-xs text-gray-500">
            Menampilkan {filteredData.length} data
          </span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-xs font-semibold uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th key={idx} className="py-3.5 px-6">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center text-gray-400">
                  Tidak ada data tersedia.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-gray-50/80 transition-colors">
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="py-4 px-6">
                      {col.accessor(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white text-xs text-gray-600">
          <div>
            Halaman <span className="font-semibold">{currentPage}</span> dari <span className="font-semibold">{totalPages}</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
