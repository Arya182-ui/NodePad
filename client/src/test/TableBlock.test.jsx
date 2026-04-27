import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TableBlock, { defaultTable } from '../components/Editor/TableBlock';

describe('defaultTable', () => {
  it('creates 3 columns and 2 data rows', () => {
    const t = defaultTable();
    expect(t.headers).toHaveLength(3);
    expect(t.rows).toHaveLength(2);
    expect(t.rows[0]).toHaveLength(3);
  });
});

describe('TableBlock', () => {
  const makeBlock = (overrides = {}) => ({
    id: '1',
    type: 'table',
    content: '',
    table: defaultTable(),
    ...overrides,
  });

  it('renders header inputs', () => {
    render(<TableBlock block={makeBlock()} onUpdate={vi.fn()} />);
    expect(screen.getAllByPlaceholderText(/Column/i).length).toBeGreaterThan(0);
  });

  it('calls onUpdate when a cell changes', () => {
    const onUpdate = vi.fn();
    render(<TableBlock block={makeBlock()} onUpdate={onUpdate} />);
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'New Header' } });
    expect(onUpdate).toHaveBeenCalled();
  });

  it('adds a row when "Add row" is clicked', () => {
    const onUpdate = vi.fn();
    render(<TableBlock block={makeBlock()} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByText(/Add row/i));
    const call = onUpdate.mock.calls[0][0];
    expect(call.table.rows).toHaveLength(3); // 2 default + 1 new
  });

  it('adds a column when + button in header is clicked', () => {
    const onUpdate = vi.fn();
    render(<TableBlock block={makeBlock()} onUpdate={onUpdate} />);
    // The add-column button is the last th button
    const addColBtn = screen.getAllByTitle('Add column')[0];
    fireEvent.click(addColBtn);
    const call = onUpdate.mock.calls[0][0];
    expect(call.table.headers).toHaveLength(4);
  });
});
