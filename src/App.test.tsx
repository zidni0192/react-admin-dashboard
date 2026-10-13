import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
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
