import React, { useState, useEffect } from 'react';
import './SelectDisk.css';

interface DFOutput {
  filesystem: string;
  size: string;
  used: string;
  avail: string;
  capacity: string;
  iused: string;
  ifree: string;
  iusedPercent: string;
  mountedOn: string;
}

const SelectDisk: React.FC = () => {
  const [output, setOutput] = useState<DFOutput[]>([]);

  useEffect(() => {
    const fetchDFOutput = async () => {
      try {
        const response = await fetch('http://localhost:5001/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ command: 'df -h' }),
        });
        const data = await response.json();
        const formattedOutput = formatDFOutput(data.output);
        setOutput(formattedOutput);
      } catch (error) {
        console.error('Error executing command', error);
      }
    };

    fetchDFOutput();
  }, []);

  const formatDFOutput = (output: string): DFOutput[] => {
    const lines = output.split('\n');
    const formattedData = lines.slice(1).filter(Boolean).map(line => {
      const [filesystem, size, used, avail, capacity, iused, ifree, iusedPercent, mountedOn] = line.split(/\s+/);
      return { filesystem, size, used, avail, capacity, iused, ifree, iusedPercent, mountedOn };
    });
    return formattedData;
  };

  return (
    <div className="select-disk">
      {output.length > 0 ? (
        <table className="output-table">
          <thead>
            <tr>
              <th>Filesystem</th>
              <th>Size</th>
              <th>Used</th>
              <th>Avail</th>
              <th>Capacity</th>
              <th>Iused</th>
              <th>Ifree</th>
              <th>%Iused</th>
              <th>Mounted on</th>
            </tr>
          </thead>
          <tbody>
            {output.map((row, index) => (
              <tr key={index}>
                <td>{row.filesystem}</td>
                <td>{row.size}</td>
                <td>{row.used}</td>
                <td>{row.avail}</td>
                <td>{row.capacity}</td>
                <td>{row.iused}</td>
                <td>{row.ifree}</td>
                <td>{row.iusedPercent}</td>
                <td>{row.mountedOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SelectDisk;
