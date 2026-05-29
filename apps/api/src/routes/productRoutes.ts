import { Router } from 'express';
import { prisma } from '@repo/database';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const productRouter = Router();

// Setup Multer for local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), 'public/uploads/products');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// --- CATEGORIES ---
productRouter.get('/categories', async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

productRouter.post('/categories', async (req, res) => {
  const { name, slug } = req.body;
  const category = await prisma.category.create({ data: { name, slug } });
  res.json(category);
});

// --- BRANDS ---
productRouter.get('/brands', async (req, res) => {
  const brands = await prisma.brand.findMany();
  res.json(brands);
});

productRouter.post('/brands', async (req, res) => {
  const { name, slug } = req.body;
  const brand = await prisma.brand.create({ data: { name, slug } });
  res.json(brand);
});

// --- PRODUCTS ---

// Utility to generate Product SKU/PartNumber
async function generatePartNumber() {
  let config = await prisma.appConfig.findUnique({ where: { key: 'PRODUCT_SKU_FORMAT' } });
  if (!config) {
    config = await prisma.appConfig.create({
      data: { key: 'PRODUCT_SKU_FORMAT', value: 'PRD-{YYYY}-{SEQ}' } 
    });
  }
  
  let seqConfig = await prisma.appConfig.findUnique({ where: { key: 'PRODUCT_SKU_SEQ' } });
  if (!seqConfig) {
    seqConfig = await prisma.appConfig.create({
      data: { key: 'PRODUCT_SKU_SEQ', value: '1' }
    });
  }

  const seq = parseInt(seqConfig.value, 10);
  const nextSeq = seq + 1;
  
  await prisma.appConfig.update({
    where: { key: 'PRODUCT_SKU_SEQ' },
    data: { value: nextSeq.toString() }
  });

  const year = new Date().getFullYear().toString();
  const seqPadded = seq.toString().padStart(4, '0');

  let partNumber = config.value.replace('{YYYY}', year).replace('{SEQ}', seqPadded);
  
  return partNumber;
}

// Get all products
productRouter.get('/', async (req, res) => {
  const { search, category, brand } = req.query;
  const where: any = {};
  
  if (search) {
    where.name = { contains: search as string, mode: 'insensitive' };
  }
  if (category) {
    where.categoryId = category;
  }
  if (brand) {
    where.brandId = brand;
  }

  const products = await prisma.product.findMany({ 
    where,
    include: { category: true, brand: true }
  });
  res.json(products);
});

// Get single product
productRouter.get('/:id', async (req, res) => {
  const product = await prisma.product.findUnique({ 
    where: { id: req.params.id },
    include: { category: true, brand: true }
  });
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(product);
});

// Create product
productRouter.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, stock, categoryId, brandId, carCompatibility } = req.body;
    
    // Auto-generate partNumber
    const partNumber = await generatePartNumber();

    let imageUrl = null;
    if (req.file) {
      // Rename file to match the partNumber (SKU)
      const ext = path.extname(req.file.originalname);
      const newFileName = `${partNumber}${ext}`;
      const oldPath = req.file.path;
      const newPath = path.join(req.file.destination, newFileName);
      
      fs.renameSync(oldPath, newPath);
      imageUrl = `/uploads/products/${newFileName}`;
    }

    const product = await prisma.product.create({
      data: {
        name,
        partNumber,
        description,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        categoryId,
        brandId,
        carCompatibility,
        imageUrl
      }
    });

    res.json(product);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create product', details: error.message });
  }
});
