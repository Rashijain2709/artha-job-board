import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ImportLogTable = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/import-logs')
      .then((res) => {
        setLogs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch logs:', err);
        setLoading(false);
      });
  }, []);

  const getColor = (value) => ({
    color: value > 0 ? 'orange' : 'black',
    fontWeight: 'bold',
  });

  if (loading) return <p>Loading import logs...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Import History Tracking</h2>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>File Name (Feed URL)</th>
            <th>Timestamp</th>
            <th>Total</th>
            <th>New</th>
            <th>Updated</th>
            <th>Failed</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td style={{ maxWidth: '300px', wordBreak: 'break-all' }}>{log.fileName}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td style={getColor(log.totalImported)}>{log.totalImported}</td>
              <td style={getColor(log.newJobs)}>{log.newJobs}</td>
              <td style={getColor(log.updatedJobs)}>{log.updatedJobs}</td>
              <td style={getColor(log.failedJobs.length)}>{log.failedJobs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ImportLogTable;
