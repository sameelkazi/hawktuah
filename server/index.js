import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { dbPromise } from './db.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// --- Products ---
app.get('/api/products', async (req, res) => {
  const db = await dbPromise;
  const products = await db.all('SELECT * FROM products');
  res.json(products);
});

app.post('/api/products', async (req, res) => {
  const db = await dbPromise;
  const p = req.body;
  await db.run(
    'INSERT INTO products (id, name, sku, category, stock, minStock, price, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    p.id, p.name, p.sku, p.category, p.stock, p.minStock, p.price, p.location, p.status
  );
  res.json(p);
});

app.put('/api/products/:id', async (req, res) => {
  const db = await dbPromise;
  const p = req.body;
  await db.run(
    'UPDATE products SET name = ?, sku = ?, category = ?, stock = ?, minStock = ?, price = ?, location = ?, status = ? WHERE id = ?',
    p.name, p.sku, p.category, p.stock, p.minStock, p.price, p.location, p.status, p.id
  );
  res.json(p);
});

app.delete('/api/products/:id', async (req, res) => {
  const db = await dbPromise;
  await db.run('DELETE FROM products WHERE id = ?', req.params.id);
  res.json({ success: true });
});

// --- Operations ---
app.get('/api/operations', async (req, res) => {
  const db = await dbPromise;
  const operations = await db.all('SELECT * FROM operations');
  // Parse items JSON
  const parsedOperations = operations.map(op => ({
    ...op,
    items: JSON.parse(op.items)
  }));
  res.json(parsedOperations);
});

app.post('/api/operations', async (req, res) => {
  const db = await dbPromise;
  const o = req.body;
  await db.run(
    'INSERT INTO operations (id, reference, type, source, destination, contact, status, scheduleDate, items) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    o.id, o.reference, o.type, o.source, o.destination, o.contact, o.status, o.scheduleDate, JSON.stringify(o.items)
  );
  res.json(o);
});

app.put('/api/operations/:id', async (req, res) => {
  const db = await dbPromise;
  const o = req.body;
  await db.run(
    'UPDATE operations SET reference = ?, type = ?, source = ?, destination = ?, contact = ?, status = ?, scheduleDate = ?, items = ? WHERE id = ?',
    o.reference, o.type, o.source, o.destination, o.contact, o.status, o.scheduleDate, JSON.stringify(o.items), o.id
  );
  res.json(o);
});

// --- Moves ---
app.get('/api/moves', async (req, res) => {
  const db = await dbPromise;
  const moves = await db.all('SELECT * FROM moves');
  res.json(moves);
});

app.post('/api/moves', async (req, res) => {
    const db = await dbPromise;
    const m = req.body;
    await db.run(
        'INSERT INTO moves (id, reference, date, product, "from", "to", quantity, status, contact, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        m.id, m.reference, m.date, m.product, m.from, m.to, m.quantity, m.status, m.contact, m.type
    );
    res.json(m);
});


// --- Warehouses ---
app.get('/api/warehouses', async (req, res) => {
  const db = await dbPromise;
  const warehouses = await db.all('SELECT * FROM warehouses');
  res.json(warehouses);
});

app.put('/api/warehouses/:id', async (req, res) => {
  const db = await dbPromise;
  const w = req.body;
  await db.run(
    'UPDATE warehouses SET name = ?, shortCode = ?, address = ? WHERE id = ?',
    w.name, w.shortCode, w.address, w.id
  );
  res.json(w);
});

// --- Locations ---
app.get('/api/locations', async (req, res) => {
  const db = await dbPromise;
  const locations = await db.all('SELECT * FROM locations');
  res.json(locations);
});


// --- Logic: Validate Operation ---
app.post('/api/operations/validate', async (req, res) => {
  const db = await dbPromise;
  const op = req.body;

  if (op.status === 'Done') {
      return res.json({ success: true, message: 'Already done' });
  }

  // 1. Update Operation Status
  const completedOp = { ...op, status: 'Done' };
  await db.run(
      'UPDATE operations SET status = ? WHERE id = ?',
      'Done', op.id
  );

  // 2. Update Stocks & Create Moves
  const items = op.items; // items are already objects in body parser

  // Need current products to check logic
  const products = await db.all('SELECT * FROM products');
  const productsMap = new Map(products.map(p => [p.id, p]));

  for (const item of items) {
      let qtyChange = 0;
      let moveType = 'internal';

      if (op.type === 'Receipt') {
          qtyChange = item.done;
          moveType = 'in';
      } else if (op.type === 'Delivery') {
          qtyChange = -item.done;
          moveType = 'out';
      } else if (op.type === 'Adjustment') {
          qtyChange = item.done;
          moveType = item.done >= 0 ? 'in' : 'out';
      } else if (op.type === 'Internal') {
          qtyChange = 0;
          moveType = 'internal';
      }

      const product = productsMap.get(item.productId);
      if (product) {
          // Create Move
          const move = {
              id: Date.now().toString() + Math.random().toString(),
              reference: op.reference,
              date: new Date().toLocaleString(),
              product: `[${product.sku}] ${product.name}`,
              from: op.source,
              to: op.destination,
              quantity: Math.abs(item.done),
              status: 'Done',
              contact: op.contact,
              type: moveType
          };

           await db.run(
              'INSERT INTO moves (id, reference, date, product, "from", "to", quantity, status, contact, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
              move.id, move.reference, move.date, move.product, move.from, move.to, move.quantity, move.status, move.contact, move.type
          );

          // Update Product Stock
          if (qtyChange !== 0) {
              const newStock = Math.max(0, product.stock + qtyChange);
              const newStatus = newStock === 0 ? 'Out of Stock' : newStock <= product.minStock ? 'Low Stock' : 'In Stock';

              await db.run(
                  'UPDATE products SET stock = ?, status = ? WHERE id = ?',
                  newStock, newStatus, product.id
              );
          }
      }
  }

  res.json({ success: true });
});

// --- Logic: Simulate ---
app.post('/api/simulate', async (req, res) => {
    const { type } = req.body;
    const db = await dbPromise;
    const products = await db.all('SELECT * FROM products');

    if (type === 'crash') {
        // Reduce stock of high value items, simulating cancelled orders or loss
        for (const p of products) {
            if (Math.random() > 0.5) continue;
            const loss = Math.floor(p.stock * 0.3);
            const newStock = p.stock - loss;
            const newStatus = newStock <= p.minStock ? 'Low Stock' : p.status;
            await db.run('UPDATE products SET stock = ?, status = ? WHERE id = ?', newStock, newStatus, p.id);
        }
    } else if (type === 'viral') {
        // Drastically reduce stock (sales surge)
        for (const p of products) {
             if (p.category !== 'Electronics' && Math.random() > 0.3) continue;
             const sales = Math.floor(p.stock * 0.6);
             const newStock = p.stock - sales;
             const newStatus = newStock <= p.minStock ? 'Low Stock' : p.status;
             await db.run('UPDATE products SET stock = ?, status = ? WHERE id = ?', newStock, newStatus, p.id);
        }
    } else if (type === 'hack') {
        // Randomize stock levels
        for (const p of products) {
             const newStock = Math.floor(Math.random() * 500);
             await db.run('UPDATE products SET stock = ?, status = ? WHERE id = ?', newStock, 'In Stock', p.id);
        }
    }
    res.json({ success: true });
});

// Reset Data
app.post('/api/reset', async (req, res) => {
    const db = await dbPromise;
    await db.run('DELETE FROM products');
    await db.run('DELETE FROM operations');
    await db.run('DELETE FROM moves');
    await db.run('DELETE FROM warehouses');
    await db.run('DELETE FROM locations');

    // Re-seed (calling setup logic or just manually insert again)
    // For simplicity, I'll just clear and rely on restart or implementing re-seed logic here.
    // But better to just implement re-seed here.

    // Actually the easiest way is to re-run the INSERTs.

    // Helper function to re-seed
    const seed = async () => {
         // Same mock data as in db.js
         const MOCK_PRODUCTS = [
            { id: '1', name: 'Steel Rods 10mm', sku: 'ST-1001', category: 'Raw Material', stock: 150, minStock: 50, price: 12.50, location: 'Rack A1', status: 'In Stock' },
            { id: '2', name: 'Aluminum Sheet', sku: 'AL-2002', category: 'Raw Material', stock: 20, minStock: 30, price: 45.00, location: 'Rack A2', status: 'Low Stock' },
            { id: '3', name: 'Office Chair X1', sku: 'FUR-3001', category: 'Furniture', stock: 0, minStock: 10, price: 120.00, location: 'Warehouse B', status: 'Out of Stock' },
            { id: '4', name: 'Copper Wire 50m', sku: 'EL-4005', category: 'Electronics', stock: 500, minStock: 100, price: 8.00, location: 'Rack C1', status: 'In Stock' },
            { id: '5', name: 'Industrial Glue', sku: 'CH-5001', category: 'Chemicals', stock: 45, minStock: 20, price: 15.50, location: 'Safe Zone', status: 'In Stock' },
        ];

        const MOCK_OPERATIONS = [
            { id: '1', reference: 'WH/IN/0001', type: 'Receipt', source: 'Vendor: SteelCo', destination: 'WH/Stock', contact: 'SteelCo Inc.', status: 'Done', scheduleDate: '2023-10-25', items: JSON.stringify([{ productId: '1', quantity: 50, done: 50 }]) },
            { id: '2', reference: 'WH/OUT/0001', type: 'Delivery', source: 'WH/Stock', destination: 'Customer: Acme Inc', contact: 'Acme Inc.', status: 'Ready', scheduleDate: '2023-10-26', items: JSON.stringify([{ productId: '3', quantity: 10, done: 0 }]) },
            { id: '3', reference: 'WH/INT/0001', type: 'Internal', source: 'WH/Stock', destination: 'WH/Production', contact: 'Internal', status: 'Draft', scheduleDate: '2023-10-27', items: JSON.stringify([{ productId: '1', quantity: 20, done: 0 }]) },
            { id: '4', reference: 'WH/IN/0002', type: 'Receipt', source: 'Vendor: AluWorld', destination: 'WH/Stock', contact: 'AluWorld Ltd.', status: 'Waiting', scheduleDate: '2023-10-28', items: JSON.stringify([{ productId: '2', quantity: 100, done: 0 }]) },
            { id: '5', reference: 'WH/ADJ/0001', type: 'Adjustment', source: 'Virtual Loss', destination: 'WH/Stock', contact: 'System', status: 'Done', scheduleDate: '2023-10-24', items: JSON.stringify([{ productId: '2', quantity: 3, done: 3 }]) },
            { id: '6', reference: 'WH/OUT/0002', type: 'Delivery', source: 'WH/Stock', destination: 'Customer: Globex', contact: 'Globex Corp', status: 'Waiting', scheduleDate: '2023-10-29', items: JSON.stringify([{ productId: '4', quantity: 50, done: 0 }]) },
        ];

        const MOCK_MOVES = [
            { id: '1', reference: 'WH/IN/0001', date: '2023-10-25 10:30', product: '[ST-1001] Steel Rods 10mm', from: 'Vendor', to: 'WH/Stock', quantity: 50, status: 'Done', contact: 'SteelCo Inc.', type: 'in' },
            { id: '2', reference: 'WH/ADJ/0001', date: '2023-10-24 14:15', product: '[AL-2002] Aluminum Sheet', from: 'Virtual Loss', to: 'WH/Stock', quantity: 3, status: 'Done', contact: 'System', type: 'internal' },
            { id: '3', reference: 'WH/OUT/0000', date: '2023-10-20 09:00', product: '[FUR-3001] Office Chair X1', from: 'WH/Stock', to: 'Customer', quantity: 5, status: 'Done', contact: 'Previous Customer', type: 'out' },
        ];

        const MOCK_WAREHOUSES = [
            { id: '1', name: 'Main Warehouse', shortCode: 'WH', address: '123 Industrial Parkway, NY' },
        ];

        const MOCK_LOCATIONS = [
            { id: '1', name: 'Stock', shortCode: 'Stock', warehouseId: '1' },
            { id: '2', name: 'Input', shortCode: 'IN', warehouseId: '1' },
            { id: '3', name: 'Output', shortCode: 'OUT', warehouseId: '1' },
            { id: '4', name: 'Quality Control', shortCode: 'QC', warehouseId: '1' },
        ];

        for (const p of MOCK_PRODUCTS) {
          await db.run(
            'INSERT INTO products (id, name, sku, category, stock, minStock, price, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            p.id, p.name, p.sku, p.category, p.stock, p.minStock, p.price, p.location, p.status
          );
        }
        for (const o of MOCK_OPERATIONS) {
          await db.run(
            'INSERT INTO operations (id, reference, type, source, destination, contact, status, scheduleDate, items) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            o.id, o.reference, o.type, o.source, o.destination, o.contact, o.status, o.scheduleDate, o.items
          );
        }
        for (const m of MOCK_MOVES) {
          await db.run(
            'INSERT INTO moves (id, reference, date, product, "from", "to", quantity, status, contact, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            m.id, m.reference, m.date, m.product, m.from, m.to, m.quantity, m.status, m.contact, m.type
          );
        }
        for (const w of MOCK_WAREHOUSES) {
          await db.run(
            'INSERT INTO warehouses (id, name, shortCode, address) VALUES (?, ?, ?, ?)',
            w.id, w.name, w.shortCode, w.address
          );
        }
        for (const l of MOCK_LOCATIONS) {
          await db.run(
            'INSERT INTO locations (id, name, shortCode, warehouseId) VALUES (?, ?, ?, ?)',
            l.id, l.name, l.shortCode, l.warehouseId
          );
        }
    };

    await seed();
    res.json({ success: true });
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
