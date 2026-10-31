const { round } = require('./orders');

const DISCOUNT_CODES = {
  WELCOME10: { type: 'percent', value: 10, minSubtotal: 0 },
  SAVE5: { type: 'fixed', value: 5, minSubtotal: 30 },
  FREESHIP: { type: 'shipping', value: 0, minSubtotal: 50 },
};

function applyDiscount(subtotal, code) {
  if (!code) {
    return { subtotal: round(subtotal), discount: 0, code: null };
  }

  const rule = DISCOUNT_CODES[code.trim().toUpperCase()];
  if (!rule) {
    throw new Error(`Unknown discount code: ${code}`);
  }
  if (subtotal < rule.minSubtotal) {
    throw new Error(`Code ${code} requires a subtotal of at least ${rule.minSubtotal}`);
  }

  let discount = 0;
  if (rule.type === 'percent') {
    discount = subtotal * (rule.value / 100);
  } else if (rule.type === 'fixed') {
    discount = Math.min(rule.value, subtotal);
  }

  return {
    subtotal: round(subtotal - discount),
    discount: round(discount),
    code: code.trim().toUpperCase(),
    freeShipping: rule.type === 'shipping',
  };
}

module.exports = { applyDiscount, DISCOUNT_CODES };
