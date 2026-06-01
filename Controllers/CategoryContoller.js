import Category from '../Models/CategorySchema.js';
import { normalizeImageUrl, fileUploadUrl } from '../utils/normalizeImageUrl.js';

const mapCategory = (category) => {
  const doc = category.toObject ? category.toObject() : category;
  return { ...doc, image: normalizeImageUrl(doc.image) };
};

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    let image = '';

    if (req.file) {
      image = fileUploadUrl(req.file);
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({
      name,
      description,
      image,
      isActive: isActive === 'true' || isActive === true
    });

    await category.save();
    res.status(201).json({ message: 'Category created successfully', category: mapCategory(category) });
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories.map(mapCategory));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

// Get single category by ID
export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if(!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(mapCategory(category));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category', error: error.message });
    }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    let updateData = { name, description, isActive: isActive === 'true' || isActive === true };

    if (req.file) {
      updateData.image = fileUploadUrl(req.file);
    } else if (req.body.image) {
      updateData.image = normalizeImageUrl(req.body.image);
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id, 
      updateData,
      { new: true }
    );
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.status(200).json({ message: 'Category updated successfully', category: mapCategory(category) });
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};
