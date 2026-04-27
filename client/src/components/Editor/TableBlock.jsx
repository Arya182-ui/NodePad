import { useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import './TableBlock.css';

// Default table structure: 3 cols × 3 rows (including header)
export const defaultTable = () => ({
  headers: ['Column 1', 'Column 2', 'Column 3'],
  rows: [
    ['', '', ''],
    ['', '', ''],
  ],
});

export default function TableBlock({ block, onUpdate }) {
  const table   = block.table || defaultTable();
  const headers = table.headers || [];
  const rows    = table.rows    || [];

  const setCell = useCallback((rowIdx, colIdx, value) => {
    const next = rows.map((r, ri) =>
      ri === rowIdx ? r.map((c, ci) => ci === colIdx ? value : c) : r
    );
    onUpdate({ table: { ...table, rows: next } });
  }, [rows, table, onUpdate]);

  const setHeader = useCallback((colIdx, value) => {
    const next = headers.map((h, i) => i === colIdx ? value : h);
    onUpdate({ table: { ...table, headers: next } });
  }, [headers, table, onUpdate]);

  const addRow = () => {
    onUpdate({ table: { ...table, rows: [...rows, Array(headers.length).fill('')] } });
  };

  const addCol = () => {
    onUpdate({ table: {
      headers: [...headers, `Column ${headers.length + 1}`],
      rows: rows.map(r => [...r, '']),
    }});
  };

  const deleteRow = (idx) => {
    if (rows.length <= 1) return;
    onUpdate({ table: { ...table, rows: rows.filter((_, i) => i !== idx) } });
  };

  const deleteCol = (idx) => {
    if (headers.length <= 1) return;
    onUpdate({ table: {
      headers: headers.filter((_, i) => i !== idx),
      rows: rows.map(r => r.filter((_, i) => i !== idx)),
    }});
  };

  return (
    <div className="tb-wrap">
      <div className="tb-scroll">
        <table className="tb-table">
          <thead>
            <tr>
              {headers.map((h, ci) => (
                <th key={ci} className="tb-th">
                  <div className="tb-cell-wrap">
                    <input
                      className="tb-input tb-input--header"
                      value={h}
                      onChange={e => setHeader(ci, e.target.value)}
                      placeholder={`Column ${ci + 1}`}
                    />
                    {headers.length > 1 && (
                      <button className="tb-del-col" onClick={() => deleteCol(ci)} title="Delete column">
                        <Trash2 size={11} strokeWidth={2} />
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th className="tb-th tb-th--add">
                <button className="tb-add-btn" onClick={addCol} title="Add column">
                  <Plus size={13} strokeWidth={2.5} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="tb-tr">
                {row.map((cell, ci) => (
                  <td key={ci} className="tb-td">
                    <input
                      className="tb-input"
                      value={cell}
                      onChange={e => setCell(ri, ci, e.target.value)}
                      placeholder="…"
                    />
                  </td>
                ))}
                <td className="tb-td tb-td--del">
                  {rows.length > 1 && (
                    <button className="tb-del-row" onClick={() => deleteRow(ri)} title="Delete row">
                      <Trash2 size={11} strokeWidth={2} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="tb-add-row" onClick={addRow}>
        <Plus size={13} strokeWidth={2.5} /> Add row
      </button>
    </div>
  );
}
