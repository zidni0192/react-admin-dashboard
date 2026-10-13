import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

afterEach(cleanup);

describe('customer directory', () => {
  it('renders customer metrics, searchable records, and empty results', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /customers/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Customers 6');
    expect(screen.getByText('Olivia Rhye')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox', { name: 'Search customers' }), { target: { value: 'circooles' } });
    expect(screen.getByText('Lana Steiner')).toBeInTheDocument();
    expect(screen.queryByText('Olivia Rhye')).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox', { name: 'Search customers' }), { target: { value: 'nobody' } });
    expect(screen.getByText('No customers match your search.')).toBeInTheDocument();
  });

  it('filters by status and updates customer status and summary', () => {
    render(<App />);
    const directory = within(screen.getByRole('region', { name: 'All customers' }));
    const tabs = within(screen.getByRole('tablist', { name: 'Customer status filters' }));
    fireEvent.click(tabs.getByRole('tab', { name: /Active\s+3/ }));
    const table = directory.getByRole('table', { name: 'Customer directory' });
    expect(within(table).getAllByRole('row')).toHaveLength(4);
    expect(within(table).getAllByRole('combobox')).toHaveLength(3);
    fireEvent.click(tabs.getByRole('tab', { name: /All customers\s+6/ }));
    fireEvent.change(screen.getByRole('combobox', { name: 'Change Olivia Rhye status' }), { target: { value: 'Suspended' } });
    expect(screen.getByRole('combobox', { name: 'Change Olivia Rhye status' })).toHaveValue('Suspended');
    expect(screen.getAllByText('2', { selector: '.stat-value' })[0]).toBeInTheDocument();
  });

  it('combines a status filter with search and reports no matching customers', () => {
    render(<App />);
    const tabs = within(screen.getByRole('tablist', { name: 'Customer status filters' }));
    const directory = within(screen.getByRole('region', { name: 'All customers' }));
    fireEvent.click(tabs.getByRole('tab', { name: /Invited\s+2/ }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Search customers' }), { target: { value: 'layers.io' } });
    expect(screen.getByText('No customers match your search.')).toBeInTheDocument();
    expect(directory.getByText(/Showing/)).toHaveTextContent('0–0 of 0 customers');
    fireEvent.change(screen.getByRole('textbox', { name: 'Search customers' }), { target: { value: 'circooles' } });
    expect(screen.getByText('Lana Steiner')).toBeInTheDocument();
    expect(directory.getByText(/Showing/)).toHaveTextContent('1–1 of 1 customers');
  });

  it('exports filtered rows as a CSV with a header and revokes its object URL', () => {
    let exportedBlob: Blob | undefined;
    const createObjectURL = vi.fn<typeof URL.createObjectURL>((object) => {
      exportedBlob = object as Blob;
      return 'blob:customer-export';
    });
    const revokeObjectURL = vi.fn();
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: createObjectURL });
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: revokeObjectURL });
    render(<App />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Search customers' }), { target: { value: 'circooles' } });
    fireEvent.click(screen.getByRole('button', { name: /Export/ }));
    expect(exportedBlob).toBeInstanceOf(Blob);
    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(click).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:customer-export');
    const blob = exportedBlob;
    if (!blob) throw new Error('CSV export did not create a Blob');
    expect(blob.type).toBe('text/csv');
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsText(blob);
    }).then((contents) => {
      expect(contents).toBe('Name,Email,Company,Status,Joined\nLana Steiner,lana@circooles.com,Circooles,Invited,Feb 18, 2025');
    });
  });

  it('adds a customer and paginates the directory', () => {
    render(<App />);
    const directory = within(screen.getByRole('region', { name: 'All customers' }));
    fireEvent.click(screen.getByRole('button', { name: /Add customer/i }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Customers 7');
    fireEvent.click(directory.getByRole('button', { name: /Previous/i }));
    expect(directory.getByText('Olivia Rhye')).toBeInTheDocument();
    fireEvent.click(directory.getByRole('button', { name: /Next/i }));
    expect(screen.getByRole('combobox', { name: 'Change New Customer 7 status' })).toBeInTheDocument();
  });
});
