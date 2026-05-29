import { Router } from 'express';
import { prisma } from '@repo/database';

export const orderRouter = Router();

// Create new order (Checkout)
orderRouter.post('/', async (req, res) => {
  try {
    // In a real app, userId comes from JWT auth middleware (req.user)
    const { userId, items, shippingAddress } = req.body;
    
    let validUserId = userId;
    if (!validUserId) {
      const fallbackUser = await prisma.user.findFirst();
      if (!fallbackUser) {
        res.status(400).json({ error: 'No users found in database to process order. Please register a user first.' });
        return;
      }
      validUserId = fallbackUser.id;
    }

    if (!items || items.length === 0) {
      res.status(400).json({ error: 'Invalid order data' });
      return;
    }

    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        res.status(404).json({ error: `Product ${item.productId} not found` });
        return;
      }
      if (product.stock < item.quantity) {
        res.status(400).json({ error: `Insufficient stock for product ${product.name}` });
        return;
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        priceAtPurchase: product.price
      });
    }

    // Database transaction to ensure data integrity
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create order
      const order = await tx.order.create({
        data: {
          userId: validUserId,
          totalAmount,
          shippingAddress,
          status: 'Waiting for Payment',
          orderItems: {
            create: orderItemsData
          }
        },
        include: { orderItems: true }
      });

      // 2. Reduce stock
      for (const item of orderItemsData) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      return order;
    });

    res.json(result);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process checkout', details: error.message });
  }
});

// Get all orders (for demo purposes)
orderRouter.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get user orders
orderRouter.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});
