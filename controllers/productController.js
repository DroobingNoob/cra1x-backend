import Product from "../models/Product.js";

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a product
export const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ message: "Product added successfully", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ message: "Product updated", product: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// routes/productRoutes.js
export const stockUpdate =  async (req, res) => {
  try {
    const { quantity } = req.body;
     const { id } = req.params;
     console.log("Trying to find product with ID:", id);

    const product = await Product.findById(id);

    console.log("Stock update route hit for product:", product);


    if (!product) return res.status(404).json({ message: "Product not found" });

    product.stock = Math.max(product.stock - quantity, 0);
    await product.save();

    res.json({ success: true, updatedStock: product.stock });
  } catch (error) {
    console.error("Stock update error:", error);
    res.status(500).json({ message: "Stock update failed" });
  }
};



