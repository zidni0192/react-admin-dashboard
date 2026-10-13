import { useMemo, useState } from 'react';

type CustomerStatus = 'Active' | 'Invited' | 'Suspended';
type Customer = { id: number; name: string; email: string; company: string; status: CustomerStatus; joined: string };

const initialCustomers: Customer[] = [
  { id: 1, name: 'Olivia Rhye', email: 'olivia@layers.io', company: 'Layers', status: 'Active', joined: 'Jan 12, 2025' },
  { id: 2, name: 'Phoenix Baker', email: 'phoenix@catalog.co', company: 'Catalog', status: 'Active', joined: 'Feb 03, 2025' },
  { id: 3, name: 'Lana Steiner', email: 'lana@circooles.com', company: 'Circooles', status: 'Invited', joined: 'Feb 18, 2025' },
  { id: 4, name: 'Demi Wilkinson', email: 'demi@sisyphus.com', company: 'Sisyphus', status: 'Suspended', joined: 'Mar 01, 2025' },
  { id: 5, name: 'Candice Wu', email: 'candice@command.com', company: 'Command', status: 'Active', joined: 'Mar 14, 2025' },
  { id: 6, name: 'Natali Craig', email: 'natali@quotient.co', company: 'Quotient', status: 'Invited', joined: 'Apr 02, 2025' },
];

export function App() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All customers');
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const filtered = useMemo(() => customers.filter((customer) => {
    const matchesQuery = `${customer.name} ${customer.email} ${customer.company}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (status === 'All customers' || customer.status === status);
  }), [customers, query, status]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const updateStatus = (id: number, next: CustomerStatus) => setCustomers((current) => current.map((customer) => customer.id === id ? { ...customer, status: next } : customer));

  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#home"><span className="brand-mark">n</span><span>northstar<span className="brand-period">.</span></span></a>
      <div className="workspace"><div className="workspace-avatar">A</div><div><strong>Acme Inc.</strong><small>Free plan</small></div><span className="workspace-chevron">⌄</span></div>
      <p className="nav-label">WORKSPACE</p>
      <nav aria-label="Main navigation">
        <a href="#overview"><span className="nav-icon">▦</span>Overview</a>
        <a className="selected" href="#customers" aria-current="page"><span className="nav-icon">♙</span>Customers<span className="nav-count">12</span></a>
        <a href="#projects"><span className="nav-icon">◫</span>Projects</a>
        <a href="#reports"><span className="nav-icon">⌁</span>Reports</a>
      </nav>
      <p className="nav-label tools-label">PREFERENCES</p>
      <nav aria-label="Preferences"><a href="#settings"><span className="nav-icon">⚙</span>Settings</a><a href="#help"><span className="nav-icon">ⓘ</span>Help & support</a></nav>
      <div className="sidebar-bottom"><div className="upgrade-card"><div className="upgrade-icon">✦</div><strong>Unlock your team's potential</strong><p>Get more from your workspace with a Pro plan.</p><button type="button">Explore plans <span>↗</span></button></div><div className="profile"><div className="profile-avatar">JD</div><div className="profile-info"><strong>Jordan Davis</strong><small>jordan@acme.com</small></div><button className="more-button" aria-label="Account options">···</button></div></div>
    </aside>

    <main className="main-content">
      <header className="topbar"><div className="breadcrumbs"><span>Workspace</span><span className="crumb-separator">/</span><strong>Customers</strong></div><div className="topbar-actions"><button className="icon-button" aria-label="Search">⌕</button><button className="icon-button notification-button" aria-label="Notifications">♧<i /></button><div className="topbar-divider" /><div className="top-avatar">JD</div></div></header>
      <section className="content-wrap">
        <div className="page-heading"><div><div className="eyebrow">DIRECTORY</div><h1>Customers <span className="heading-count">{customers.length}</span></h1><p className="page-subtitle">Manage your customer accounts and their access.</p></div><button className="primary-button" onClick={() => { const id = Math.max(0, ...customers.map((customer) => customer.id)) + 1; setCustomers((current) => [...current, { id, name: `New Customer ${id}`, email: `customer${id}@example.com`, company: 'New account', status: 'Invited', joined: 'Today' }]); setPage(Math.ceil((filtered.length + 1) / pageSize)); }}><span className="plus">＋</span> Add customer</button></div>
        <div className="stats-grid"><article className="stat-card"><div className="stat-top"><span>Total customers</span><span className="stat-icon purple">♙</span></div><div className="stat-value">{customers.length}<span className="stat-change">↗ 12.5%</span></div><div className="stat-foot">Compared to last month</div></article><article className="stat-card"><div className="stat-top"><span>Active customers</span><span className="stat-icon green">✓</span></div><div className="stat-value">{customers.filter((customer) => customer.status === 'Active').length}<span className="stat-change">↗ 8.2%</span></div><div className="stat-foot">Compared to last month</div></article><article className="stat-card"><div className="stat-top"><span>Pending invitations</span><span className="stat-icon amber">✉</span></div><div className="stat-value">{customers.filter((customer) => customer.status === 'Invited').length}<span className="stat-change neutral">Needs attention</span></div><div className="stat-foot">Awaiting customer response</div></article><article className="stat-card"><div className="stat-top"><span>Avg. engagement</span><span className="stat-icon blue">⌁</span></div><div className="stat-value">84.6%<span className="stat-change">↗ 4.3%</span></div><div className="stat-foot">Compared to last month</div></article></div>
        <section className="directory-card" aria-labelledby="directory-title"><div className="directory-heading"><div><h2 id="directory-title">All customers</h2><p>A list of everyone in your workspace.</p></div><button className="export-button" type="button" onClick={() => { const csv = ['Name,Email,Company,Status,Joined', ...filtered.map((customer) => [customer.name, customer.email, customer.company, customer.status, customer.joined].join(','))].join('\n'); const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); link.download = 'customers.csv'; link.click(); URL.revokeObjectURL(link.href); }}>⇩ <span>Export</span></button></div>
          <div className="table-toolbar"><div className="table-tabs" role="tablist" aria-label="Customer status filters"><button role="tab" aria-selected={status === 'All customers'} className={status === 'All customers' ? 'tab active-tab' : 'tab'} onClick={() => { setStatus('All customers'); setPage(1); }}>All customers <span>{customers.length}</span></button><button role="tab" aria-selected={status === 'Active'} className={status === 'Active' ? 'tab active-tab' : 'tab'} onClick={() => { setStatus('Active'); setPage(1); }}>Active <span>{customers.filter((customer) => customer.status === 'Active').length}</span></button><button role="tab" aria-selected={status === 'Invited'} className={status === 'Invited' ? 'tab active-tab' : 'tab'} onClick={() => { setStatus('Invited'); setPage(1); }}>Invited <span>{customers.filter((customer) => customer.status === 'Invited').length}</span></button></div><div className="table-actions"><label className="search-field"><span>⌕</span><input aria-label="Search customers" placeholder="Search customers..." value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} /></label><button className="filter-button" onClick={() => { setStatus(status === 'Suspended' ? 'All customers' : 'Suspended'); setPage(1); }}>☷ <span>Filter</span></button></div></div>
          <div className="table-scroll"><table aria-label="Customer directory"><thead><tr><th><input aria-label="Select all customers" type="checkbox" /></th><th>NAME <span className="sort">↕</span></th><th>STATUS</th><th>COMPANY</th><th>JOINED DATE</th><th><span className="visually-hidden">Actions</span></th></tr></thead><tbody>{visible.map((customer) => <tr key={customer.id}><td><input aria-label={`Select ${customer.name}`} type="checkbox" /></td><td><div className="customer-cell"><div className={`customer-avatar avatar-${customer.id % 6}`}>{customer.name.split(' ').map((part) => part[0]).join('')}</div><div><strong>{customer.name}</strong><small>{customer.email}</small></div></div></td><td><label className={`status-pill status-${customer.status.toLowerCase()}`}><span />{customer.status}<select aria-label={`Change ${customer.name} status`} value={customer.status} onChange={(event) => updateStatus(customer.id, event.target.value as CustomerStatus)}><option>Active</option><option>Invited</option><option>Suspended</option></select></label></td><td><span className="company-name">{customer.company}</span></td><td className="joined-date">{customer.joined}</td><td><button className="row-menu" aria-label={`More options for ${customer.name}`}>···</button></td></tr>)}</tbody></table>{visible.length === 0 && <div className="empty-state">No customers match your search.</div>}</div>
          <footer className="table-footer"><span>Showing <strong>{filtered.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)}</strong> of <strong>{filtered.length}</strong> customers</span><div className="pagination"><button disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>← <span>Previous</span></button><button disabled={page >= pages} onClick={() => setPage((current) => current + 1)}><span>Next</span> →</button></div></footer>
        </section>
        <footer className="page-footer"><span>© 2025 Northstar, Inc.</span><span className="footer-links"><a href="#privacy">Privacy</a><a href="#terms">Terms</a><a href="#support">Support</a></span><span className="status-indicator"><i /> All systems operational</span></footer>
      </section>
    </main>
  </div>;
}
