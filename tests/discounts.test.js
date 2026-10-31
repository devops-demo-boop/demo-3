const request = require('supertest');
const app = require('../src/app');
const { applyDiscount } = require('../src/discounts');

test.each([
    [40, undefined, 'subtotal', 40],
    [50, 'welcome10', 'discount', 5],
    [40, 'SAVE5', 'subtotal', 35],
    [60, 'FREESHIP', 'freeShipping', true],
])('applyDiscount(%p, %p).%s is %p', (subtotal, code, key, value) => {
    expect(applyDiscount(subtotal, code)[key]).toBe(value);
});
test('reject unknown code and subtotals below the minium', () =>{
    expect(() => applyDiscount(40, 'BOGUS')).toThrow('Unknown discount code');
    expect(() => applyDiscount(10, 'SAVE5')).toThrow('at least 30');
});
test('POST /orders/discount returns 422 for a bad code and 400 for a bad subtotal', async () => {
    const post = (body) => request(app).post('/orders/discount').send(body);
    expect((await post ({ subtotal: 40, code: 'BOGUS'})).status).toBe(422);
    expect((await post ({ subtotal: 'x'})).status).toBe(400);
});