import Product from '../Models/ProductSchema.js';
import { normalizeImageUrl, fileUploadUrl } from '../utils/normalizeImageUrl.js';

const mapProduct = (product) => {
  const doc = product.toObject ? product.toObject() : product;
  return {
    ...doc,
    main_image: normalizeImageUrl(doc.main_image),
    gallery_images: (doc.gallery_images || []).map(normalizeImageUrl).filter(Boolean),
  };
};

// Create a new product
export const createProduct = async (req, res) => {
    try {
        const productData = { ...req.body };

        // Handle main image
        if (req.files && req.files.main_image) {
            productData.main_image = fileUploadUrl(req.files.main_image[0]);
        } else if (productData.main_image) {
            productData.main_image = normalizeImageUrl(productData.main_image);
        }

        if (req.files && req.files.gallery_images) {
            productData.gallery_images = req.files.gallery_images.map(fileUploadUrl);
        }

        const product = new Product(productData);
        await product.save();
        res.status(201).json({ message: 'Product created successfully', product: mapProduct(product) });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

// Get all products
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category_id', 'name');
        res.status(200).json(products.map(mapProduct));

    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

// Get single product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category_id', 'name');
        if (!product) {

            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(mapProduct(product));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
};

// Update product
export const updateProduct = async (req, res) => {
    try {
        const updateData = { ...req.body };

        // Handle main image update
        if (req.files && req.files.main_image) {
            updateData.main_image = fileUploadUrl(req.files.main_image[0]);
        } else if (updateData.main_image) {
            updateData.main_image = normalizeImageUrl(updateData.main_image);
        }

        if (req.files && req.files.gallery_images) {
            const newGalleryImages = req.files.gallery_images.map(fileUploadUrl);
            // If user wants to append or replace, that depends on frontend logic. 
            // For now, we'll replace the gallery if new images are provided.
            updateData.gallery_images = newGalleryImages;
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully', product: mapProduct(product) });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

// Delete product
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};
