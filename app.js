let sales = [
  { order: '#QSL-1048', initials: 'ML', customer: 'Marcus Lee', email: 'marcus.lee@email.com', phone: '(555) 210-8841', item: 'Fender Player Stratocaster', channel: 'Shopify', amount: '$1,149.00' },
  { order: '#QSL-1047', initials: 'AS', customer: 'Avery Smith', email: 'avery.smith@email.com', phone: '(555) 210-4412', item: 'Taylor 214ce-K', channel: 'In-store', amount: '$899.00' },
  { order: '#QSL-1046', initials: 'JR', customer: 'Jamie Rivera', email: 'jamie.rivera@email.com', phone: '(555) 210-1138', item: 'Gibson Les Paul Studio', channel: 'Website', amount: '$1,299.00' },
  { order: '#QSL-1045', initials: 'NK', customer: 'Noah Kim', email: 'noah.kim@email.com', phone: '(555) 210-5590', item: 'Squier Classic Vibe 60s', channel: 'In-store', amount: '$429.00' }
];
const defaultEngagement = {
  'marcus.lee@email.com': { outreach: 4, chats: [{ time: 'Today, 10:24 AM', message: 'Thanks for helping me compare the Stratocaster options.', reply: 'You’re welcome. The Player Strat is still held for you until 6 PM.' }, { time: 'Oct 22, 3:18 PM', message: 'Is the Fender Player Stratocaster still available?', reply: 'Yes, it is available on the shop floor.' }] },
  'avery.smith@email.com': { outreach: 2, chats: [{ time: 'Oct 20, 11:02 AM', message: 'Do you offer local pickup?', reply: 'Yes, your Taylor is ready for pickup at the front desk.' }] },
  'jamie.rivera@email.com': { outreach: 6, chats: [{ time: 'Oct 19, 4:41 PM', message: 'I’d like to see more photos of the Les Paul neck.', reply: 'I sent those over and added them to your order.' }] },
  'noah.kim@email.com': { outreach: 1, chats: [{ time: 'Oct 18, 9:12 AM', message: 'Can I trade in another guitar toward this purchase?', reply: 'Absolutely. Bring it in and we can appraise it.' }] }
};
let customers = sales.map(sale => ({ name: sale.customer, email: sale.email, phone: sale.phone, orders: 1, spent: sale.amount, ...(defaultEngagement[sale.email] || { outreach: 0, chats: [] }) }));
let inventory = [
  { name: 'Fender Player Stratocaster', brand: 'Fender', sku: 'QSL-FEN-104', condition: 'Excellent', location: 'Floor A · 04', price: '$1,149.00', stock: 2, type: '' },
  { name: 'Taylor 214ce-K', brand: 'Taylor', sku: 'QSL-TAY-082', condition: 'Very good', location: 'Floor A · 11', price: '$899.00', stock: 1, type: 'blue-art' },
  { name: 'Gibson Les Paul Studio', brand: 'Gibson', sku: 'QSL-GIB-031', condition: 'Good', location: 'Floor B · 02', price: '$1,299.00', stock: 1, type: 'red-art' },
  { name: 'Squier Classic Vibe 60s', brand: 'Squier', sku: 'QSL-SQU-219', condition: 'Excellent', location: 'Floor A · 08', price: '$429.00', stock: 4, type: '' },
  { name: 'Martin D-10E Road Series', brand: 'Martin', sku: 'QSL-MAR-055', condition: 'Excellent', location: 'Floor B · 07', price: '$749.00', stock: 3, type: 'blue-art' },
  { name: 'Gretsch G2622 Streamliner', brand: 'Gretsch', sku: 'QSL-GRE-144', condition: 'Very good', location: 'Floor A · 12', price: '$599.00', stock: 0, type: 'red-art' }
];
const lowStock = inventory.filter(item => item.stock <= 1);

function icon(name) { return `<i data-lucide="${name}"></i>`; }
function refreshIcons() { if (window.lucide) lucide.createIcons(); }
function showToast(message) { const toast = document.getElementById('toast'); toast.querySelector('span').textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2600); }

function renderSales() {
  const markup = sales.map(sale => `<tr><td>${sale.order}</td><td><div class="order-customer"><span class="mini-avatar">${sale.initials}</span><strong>${sale.customer}</strong></div></td><td>${sale.item}</td><td><span class="channel-tag">${sale.channel}</span></td><td><strong>${sale.amount}</strong></td><td><span class="status-tag paid">Paid</span></td></tr>`).join('');
  document.getElementById('recent-sales').innerHTML = markup;
  document.getElementById('sales-body').innerHTML = markup;
  document.getElementById('sales-count').textContent = `${sales.length} transactions`;
}
function renderCustomers(query = '') {
  const normalized = query.toLowerCase();
  const filtered = customers.filter(customer => `${customer.name} ${customer.email} ${customer.phone}`.toLowerCase().includes(normalized));
  document.getElementById('customer-count').textContent = filtered.length;
  document.getElementById('customer-grid').innerHTML = filtered.map(customer => `<article class="customer-card" tabindex="0" data-customer-email="${customer.email}"><div class="customer-card-top"><span class="customer-avatar">${customer.name.split(' ').map(part => part[0]).join('').slice(0, 2)}</span><span class="customer-orders">${customer.orders} ${customer.orders === 1 ? 'order' : 'orders'}</span></div><h2>${customer.name}</h2><p>${customer.email}</p><p>${customer.phone || 'No phone added'}</p><div class="customer-spend"><span>Total spent</span><b>${customer.spent}</b></div></article>`).join('') || '<div class="empty-customers">No customers match your search.</div>';
}
function renderCustomerDetail(email) {
  const customer = customers.find(record => record.email === email);
  if (!customer) return;
  const purchases = sales.filter(sale => sale.email === email);
  const engagement = customer.chats || [];
  document.getElementById('customer-detail-content').innerHTML = `<div class="detail-header"><span class="customer-avatar detail-avatar">${customer.name.split(' ').map(part => part[0]).join('').slice(0, 2)}</span><div><h2>${customer.name}</h2><p>${customer.email} · ${customer.phone || 'No phone added'}</p></div></div><div class="detail-stats"><div class="detail-stat"><span>Guitars bought</span><b>${purchases.length}</b></div><div class="detail-stat"><span>Times reached out</span><b>${customer.outreach || 0}</b></div><div class="detail-stat"><span>Total spent</span><b>${customer.spent}</b></div></div><div class="detail-section"><h3>Guitars purchased</h3>${purchases.map(sale => `<div class="purchase-row">${icon('guitar')}<div><b>${sale.item}</b><small>${sale.order} · ${sale.channel}</small></div><span class="purchase-price">${sale.amount}</span></div>`).join('') || '<p class="empty-detail">No guitars purchased yet.</p>'}</div><div class="detail-section"><h3>Recent website chats</h3>${engagement.map(chat => `<div class="chat-row"><span class="chat-bubble">${icon('message-circle')}</span><div><b>${chat.message}</b><small>${chat.time}</small><small><strong>Q's Loan:</strong> ${chat.reply}</small></div></div>`).join('') || '<p class="empty-detail">No website chats recorded yet.</p>'}</div>`;
  document.getElementById('customer-detail-modal').classList.remove('hidden');
  refreshIcons();
}
function guitarIcon(type = '') { return `<span class="item-art ${type}">${icon('guitar')}</span>`; }
function renderLowStock() {
  document.getElementById('low-stock-list').innerHTML = lowStock.slice(0, 4).map(item => `<div class="low-item">${guitarIcon(item.type)}<div><b>${item.name}</b><small>${item.sku}</small></div><span class="stock-alert">${item.stock === 0 ? 'Out' : `${item.stock} left`}</span></div>`).join('');
}
function renderInventory(filter = 'all', query = '') {
  const normalized = query.toLowerCase();
  const filtered = inventory.filter(item => {
    const matchesQuery = !normalized || `${item.name} ${item.brand} ${item.sku}`.toLowerCase().includes(normalized);
    const matchesFilter = filter === 'all' || (filter === 'low' && item.stock <= 1) || (filter === 'draft' && item.stock === 0);
    return matchesQuery && matchesFilter;
  });
  document.getElementById('inventory-count').textContent = filtered.length;
  document.getElementById('inventory-body').innerHTML = filtered.map(item => `<tr><td class="check-col"><input type="checkbox" /></td><td><div class="item-cell">${guitarIcon(item.type)}<div><b>${item.name}</b><small>${item.brand}</small></div></div></td><td><span class="channel-tag">${item.sku}</span></td><td><span class="condition">${item.condition}</span></td><td><span class="location">${item.location}</span></td><td><span class="price">${item.price}</span></td><td><span class="${item.stock <= 1 ? 'stock-low' : 'stock-good'}">${item.stock === 0 ? 'Out of stock' : `${item.stock} in stock`}</span></td><td><div class="channel-dots"><span class="shopify-dot">S</span><span>${icon('globe-2')}</span></div></td><td class="more-cell">${icon('more-horizontal')}</td></tr>`).join('') || '<tr><td colspan="9" class="empty-state">No items match your search.</td></tr>';
  refreshIcons();
}
function showView(view) {
  document.querySelectorAll('.page-view').forEach(page => page.classList.add('hidden'));
  document.getElementById(`${view}-view`)?.classList.remove('hidden');
  document.querySelectorAll('.nav-item[data-view]').forEach(button => button.classList.toggle('active', button.dataset.view === view));
  const title = view[0].toUpperCase() + view.slice(1);
  document.getElementById('page-breadcrumb').textContent = title;
  document.querySelector('.sidebar')?.classList.remove('open');
  if (view === 'inventory') renderInventory();
  if (view === 'sales') renderSales();
  if (view === 'customers') renderCustomers();
}
function openSaleModal() {
  document.getElementById('sale-item-select').innerHTML = inventory.filter(item => item.stock > 0).map(item => `<option value="${item.name}" data-price="${item.price.replace(/[$,]/g, '')}">${item.name} · ${item.price}</option>`).join('');
  const firstItem = document.querySelector('#sale-item-select option');
  if (firstItem) document.querySelector('#sale-form [name="amount"]').value = firstItem.dataset.price;
  document.getElementById('sale-modal').classList.remove('hidden');
  refreshIcons();
}

document.addEventListener('click', event => {
  const navButton = event.target.closest('[data-view]');
  if (navButton) showView(navButton.dataset.view);
  if (event.target.closest('#new-sale-button') || event.target.closest('#sales-new-button')) { showView('sales'); openSaleModal(); }
  if (event.target.closest('.mobile-menu')) document.querySelector('.sidebar').classList.toggle('open');
  if (event.target.closest('#add-item-button')) document.getElementById('item-modal').classList.remove('hidden');
  if (event.target.closest('.close-modal') || event.target.id === 'item-modal') document.getElementById('item-modal').classList.add('hidden');
  if (event.target.closest('#add-customer-button')) document.getElementById('customer-modal').classList.remove('hidden');
  if (event.target.closest('.close-sale-modal') || event.target.id === 'sale-modal') document.getElementById('sale-modal').classList.add('hidden');
  if (event.target.closest('.close-customer-modal') || event.target.id === 'customer-modal') document.getElementById('customer-modal').classList.add('hidden');
  if (event.target.closest('.close-detail-modal') || event.target.id === 'customer-detail-modal') document.getElementById('customer-detail-modal').classList.add('hidden');
  const customerCard = event.target.closest('[data-customer-email]');
  if (customerCard) renderCustomerDetail(customerCard.dataset.customerEmail);
  const filter = event.target.closest('.filter');
  if (filter) { document.querySelectorAll('.filter').forEach(button => button.classList.remove('active-filter')); filter.classList.add('active-filter'); renderInventory(filter.dataset.filter, document.getElementById('inventory-search').value); }
});
document.getElementById('inventory-search')?.addEventListener('input', event => { const filter = document.querySelector('.active-filter')?.dataset.filter || 'all'; renderInventory(filter, event.target.value); });
document.getElementById('sales-search')?.addEventListener('input', event => { const query = event.target.value.toLowerCase(); document.getElementById('sales-body').innerHTML = sales.filter(sale => `${sale.order} ${sale.customer} ${sale.item}`.toLowerCase().includes(query)).map(sale => `<tr><td>${sale.order}</td><td><div class="order-customer"><span class="mini-avatar">${sale.initials}</span><strong>${sale.customer}</strong></div></td><td>${sale.item}</td><td><span class="channel-tag">${sale.channel}</span></td><td><strong>${sale.amount}</strong></td><td><span class="status-tag paid">Paid</span></td></tr>`).join(''); });
document.getElementById('customer-search')?.addEventListener('input', event => renderCustomers(event.target.value));
document.getElementById('customer-grid')?.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { const card = event.target.closest('[data-customer-email]'); if (card) { event.preventDefault(); renderCustomerDetail(card.dataset.customerEmail); } } });
document.getElementById('sale-item-select')?.addEventListener('change', event => { const option = event.target.selectedOptions[0]; document.querySelector('#sale-form [name="amount"]').value = option?.dataset.price || ''; });
document.getElementById('item-form').addEventListener('submit', event => {
  event.preventDefault(); const form = new FormData(event.target); const price = Number(form.get('price')).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  inventory.unshift({ name: form.get('name'), brand: form.get('brand'), sku: form.get('sku'), condition: 'New', location: 'Back stock', price, stock: Number(form.get('stock')), type: '' });
  event.target.reset(); document.getElementById('item-modal').classList.add('hidden'); showView('inventory'); showToast('Item added to inventory');
});
document.getElementById('sale-form').addEventListener('submit', event => {
  event.preventDefault(); const form = new FormData(event.target); const customerEmail = form.get('email').toLowerCase(); const amount = Number(form.get('amount')).toLocaleString('en-US', { style: 'currency', currency: 'USD' }); const name = form.get('customer'); const initials = name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();
  const existingCustomer = customers.find(customer => customer.email.toLowerCase() === customerEmail);
  if (existingCustomer) { existingCustomer.orders += 1; existingCustomer.spent = `$${(Number(existingCustomer.spent.replace(/[$,]/g, '')) + Number(form.get('amount'))).toLocaleString('en-US', { minimumFractionDigits: 2 })}`; } else customers.unshift({ name, email: form.get('email'), phone: form.get('phone'), orders: 1, spent: amount, outreach: 0, chats: [] });
  sales.unshift({ order: `#QSL-${1049 + sales.length}`, initials, customer: name, email: form.get('email'), phone: form.get('phone'), item: form.get('item'), channel: form.get('channel'), amount });
  const soldItem = inventory.find(item => item.name === form.get('item')); if (soldItem && soldItem.stock > 0) soldItem.stock -= 1;
  event.target.reset(); document.getElementById('sale-modal').classList.add('hidden'); renderSales(); renderLowStock(); showView('sales'); showToast(`Sale recorded for ${name}`);
});
document.getElementById('customer-form').addEventListener('submit', event => {
  event.preventDefault(); const form = new FormData(event.target); const name = form.get('name'); customers.unshift({ name, email: form.get('email'), phone: form.get('phone'), orders: 0, spent: '$0.00', outreach: 0, chats: [] }); event.target.reset(); document.getElementById('customer-modal').classList.add('hidden'); renderCustomers(); showToast(`${name} added to customers`);
});
renderSales(); renderLowStock(); renderInventory(); renderCustomers(); refreshIcons();