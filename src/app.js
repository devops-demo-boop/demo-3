const express = require('express');
const { calculateTotal, sortByNewest } = require('./orders');
const { applyDiscount } = require('./discounts');

const app = express();
app.use(express.json());

const orders = [
  { id: 'A-1001', createdAt: '2026-10-01T09:00:00Z', items: [{ sku: 'MUG', price: 12.5, quantity: 2 }] },
  { id: 'A-1002', createdAt: '2026-10-03T14:30:00Z', items: [{ sku: 'TEE', price: 20, quantity: 1 }] },
  { id: 'A-1003', createdAt: '2026-10-02T11:15:00Z', items: [{ sku: 'CAP', price: 15, quantity: 3 }] },
];

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/orders', (req, res) => {
  res.json(sortByNewest(orders));
});

app.post('/orders/quote', (req, res) => {
  const { items } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items must be a non-empty array' });
  }
  return res.json(calculateTotal(items));
});

app.post('/orders/discount', (req, res) => {
  const { subtotal, code } = req.body || {};
  if (typeof subtotal !== 'number' || subtotal < 0) {
    return res.status(400).json({ error: 'subtotal must be a non-negative number' });
  }
  try {
    return res.json(applyDiscount(subtotal, code));
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

module.exports = app;
