'use client'; // Enable client-side features

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';

interface DataResponse {
  columns: string[];
  data: any[][];
}

export default function Home() {
  const [data, setData] = useState<DataResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/data');
        console.log('Fetched data:', response.data); // Log the data
        setData(response.data);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data.');
      }
    };
    fetchData();
  }, []);

  const columns = React.useMemo(
    () => data ? data.columns.map(col => ({ Header: col, accessor: col })) : [],
    [data]
  );

  const tableData = React.useMemo(
    () => data ? data.data.map(row => row.reduce((acc, value, index) => ({
      ...acc,
      [data.columns[index]]: value
    }), {})) : [],
    [data]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: tableData });

  return (
    <div>
      <h1>Stock Data</h1>
      {error ? (
        <p>{error}</p>
      ) : data ? (
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
