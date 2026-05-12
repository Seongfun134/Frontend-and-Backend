const mongoose = require("mongoose");
const Product = require("../models/Product");

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, inStock, imageUrl } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: "Product name is required" });
    }

    if (price === undefined || price === null) {
      return res.status(400).json({ error: "Price is required" });
    }

    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({ error: "Price must be a positive number" });
    }

    const product = new Product({
      name: String(name).trim(),
      description,
      price,
      category,
      inStock: inStock !== undefined ? inStock : true,
      imageUrl,
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update product (partial)
const updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const { name, description, price, category, inStock, imageUrl } = req.body;

    if (name !== undefined && !String(name).trim()) {
      return res.status(400).json({ error: "Product name cannot be empty" });
    }

    if (price !== undefined && (typeof price !== "number" || price <= 0)) {
      return res.status(400).json({ error: "Price must be a positive number" });
    }

    const updates = {};
    if (name !== undefined) updates.name = String(name).trim();
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = price;
    if (category !== undefined) updates.category = category;
    if (inStock !== undefined) updates.inStock = inStock;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
