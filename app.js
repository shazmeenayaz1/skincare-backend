import express from 'express';
import cors from 'cors';
import categoryRouter from './Routes/CategoryRouter.js';
import bannerRouter from './Routes/BannerRoutes.js';
import productRouter from './Routes/ProductRoutes.js';
import authRouter from './Routes/AuthRoutes.js';
import userRouter from './Routes/UserRoutes.js';
import orderRouter from './Routes/OrderRoutes.js';
import stripeRouter from './Routes/StripeRoutes.js';



const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/categories', categoryRouter);
app.use('/banners', bannerRouter);
app.use('/products', productRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/orders', orderRouter);
app.use('/stripe', stripeRouter);





// Basic Health Check Route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'SkinCare API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

export default app;