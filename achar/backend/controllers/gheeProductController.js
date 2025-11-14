import GheeProduct from "../models/GheeProduct.js";
import Category from "../models/Category.js";

// ---------------- Create GheeProduct ----------------
export const createGheeProduct = async (req, res) => {
  try {
    const gheeProduct = new GheeProduct({
      ...req.body,
      stock: req.body.stock ?? true,
      pricePerGram: req.body.pricePerGram || "",
      stockQuantity: req.body.stockQuantity || 0, 
    });
    await gheeProduct.save();
    res.status(201).json(gheeProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ---------------- Get all GheeProducts ----------------
export const getGheeProducts = async (req, res) => {
  try {
    const gheeProducts = await GheeProduct.find().populate("category");
    res.json(gheeProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- Get GheeProduct by slug ----------------
export const getGheeProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const gheeProduct = await GheeProduct.findOne({ slug }).populate("category");
    if (!gheeProduct) return res.status(404).json({ message: "Product not found" });
    res.json(gheeProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- Update GheeProduct ----------------
export const updateGheeProduct = async (req, res) => {
  try {
    const gheeProduct = await GheeProduct.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!gheeProduct) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "✅ Product updated successfully", gheeProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- Delete GheeProduct ----------------
export const deleteGheeProduct = async (req, res) => {
  try {
    const gheeProduct = await GheeProduct.findByIdAndDelete(req.params.id);
    if (!gheeProduct) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "🗑️ Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- Get products by category slug ----------------
export const getGheeProductsByCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });
    if (!category) return res.status(404).json({ message: "Category not found" });

    const products = await GheeProduct.find({ category: category._id }).populate("category");
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ---------------- Get GheeProduct by slug & id ----------------
export const getGheeProductBySlugAndId = async (req, res) => {
  try {
    const { slug, id } = req.params;
    const gheeProduct = await GheeProduct.findOne({ _id: id, slug }).populate("category");
    if (!gheeProduct) return res.status(404).json({ message: "Product not found" });
    res.json(gheeProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- Add Review ----------------
export const addGheeReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rating, comment, images } = req.body;

    const gheeProduct = await GheeProduct.findById(id);
    if (!gheeProduct) return res.status(404).json({ message: "Product not found" });

    // Add review
    gheeProduct.reviews.push({ name, rating, comment, images });

    // Update average rating & number of reviews
    if (gheeProduct.reviews.length === 0) {
      gheeProduct.rating = 0;
      gheeProduct.numberOfReviews = 0;
    } else {
      const total = gheeProduct.reviews.reduce((acc, review) => acc + review.rating, 0);
      gheeProduct.rating = (total / gheeProduct.reviews.length).toFixed(1);
      gheeProduct.numberOfReviews = gheeProduct.reviews.length;
    }

    await gheeProduct.save();
    res.status(201).json({
      message: "✅ Review added successfully",
      reviews: gheeProduct.reviews,
      rating: gheeProduct.rating,
      numberOfReviews: gheeProduct.numberOfReviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ---------------- Get Similar Products ----------------
export const getSimilarGheeProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await GheeProduct.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Find products from same category excluding current product
    const similarProducts = await GheeProduct.find({
      category: product.category,
      _id: { $ne: id },
    }).limit(8); // max 8 similar products

    res.json(similarProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const searchProductsByName = async (req, res) => {
  try {
    const { query } = req.params;

    const products = await GheeProduct.find({
      title: { $regex: query, $options: "i" }, // GheeProduct uses "title" not "productName"
    }).populate("category", "name slug");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ---------------- Get Low Stock Ghee Products ----------------
// ---------------- Get Low Stock Ghee Products ----------------
export const getLowStockGheeProducts = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 5;

    const lowStockProducts = await GheeProduct.find({
      stockQuantity: { $lte: threshold },
    })
      .select("title stockQuantity images")
      .sort({ stockQuantity: 1 });

    res.json(lowStockProducts);
  } catch (error) {
    console.error("Error fetching low stock Ghee products:", error);
    res.status(500).json({ message: "Server error" });
  }
};


