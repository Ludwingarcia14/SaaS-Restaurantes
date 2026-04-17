import express from 'express';
import authRoutes from './modules/auth/auth.routes';
import productRoutes from './modules/product/product.routes';
import inventoryRoutes from './modules/inventory/inventory.routes';
const app = express();

app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
export default app;