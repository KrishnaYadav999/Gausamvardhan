import MasalaProduct from "../models/MasalaProduct.js";
import Category from "../models/Category.js";

// -------------------- Create a new Masala Product --------------------
export const createMasalaProduct = async (req, res) => {
  try {
    const { category: categoryId } = req.body;

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) return res.status(400).json({ error: "Invalid category ID" });

    // Ensure cut_price and current_price are strings or null
    if (req.body.cut_price !== undefined) req.body.cut_price = req.body.cut_price?.toString() || null;
    if (req.body.current_price !== undefined) req.body.current_price = req.body.current_price?.toString() || null;

    // Ensure images is an array
    if (req.body.images && !Array.isArray(req.body.images)) {
      req.body.images = [req.body.images];
    }

    // Ensure moreAboutProduct is an array
    if (req.body.moreAboutProduct && !Array.isArray(req.body.moreAboutProduct)) {
      req.body.moreAboutProduct = [req.body.moreAboutProduct];
    }

    const product = await MasalaProduct.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// -------------------- Get all Masala Products --------------------
export const getAllMasalaProducts = async (req, res) => {
  try {
    const products = await MasalaProduct.find({}).populate("category", "name slug");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Get single Masala Product by ID --------------------
export const getMasalaProduct = async (req, res) => {
  try {
    const product = await MasalaProduct.findById(req.params.id).populate("category", "name slug");
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Update Masala Product --------------------
export const updateMasalaProduct = async (req, res) => {
  try {
    if (req.body.category) {
      const category = await Category.findById(req.body.category);
      if (!category) return res.status(400).json({ error: "Invalid category ID" });
    }

    // Ensure cut_price and current_price are strings or null
    if (req.body.cut_price !== undefined) req.body.cut_price = req.body.cut_price?.toString() || null;
    if (req.body.current_price !== undefined) req.body.current_price = req.body.current_price?.toString() || null;

    // Ensure images is an array
    if (req.body.images && !Array.isArray(req.body.images)) {
      req.body.images = [req.body.images];
    }

    // Ensure moreAboutProduct is an array
    if (req.body.moreAboutProduct && !Array.isArray(req.body.moreAboutProduct)) {
      req.body.moreAboutProduct = [req.body.moreAboutProduct];
    }

    const product = await MasalaProduct.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// -------------------- Delete Masala Product --------------------
export const deleteMasalaProduct = async (req, res) => {
  try {
    const product = await MasalaProduct.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Get products by category slug --------------------
export const getMasalaProductsByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ error: "Category not found" });

    const products = await MasalaProduct.find({ category: category._id });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Get single product by category slug + product ID --------------------
export const getMasalaProductBySlugAndId = async (req, res) => {
  try {
    const product = await MasalaProduct.findById(req.params.id).populate("category", "name slug");
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Add a review to Masala Product --------------------
export const addMasalaProductReview = async (req, res) => {
  try {
    const { name, rating, comment, images } = req.body;
    const product = await MasalaProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const newReview = { name, rating, comment, images };
    product.reviews.push(newReview);

    // Update average rating and number of reviews
    const total = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    product.rating = (total / product.reviews.length).toFixed(1);
    product.numberOfReviews = product.reviews.length;

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




// -------------------- Get Similar Masala Products --------------------
export const getSimilarMasalaProducts = async (req, res) => {
  try {
    const product = await MasalaProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const similarProducts = await MasalaProduct.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(8);

    res.status(200).json(similarProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// -------------------- Search Masala Products --------------------
export const searchMasalaProducts = async (req, res) => {
  try {
    const query = req.params.query;

    // Search by productName or title (case-insensitive)
    const products = await MasalaProduct.find({
      $or: [
        { productName: { $regex: query, $options: "i" } },
        { title: { $regex: query, $options: "i" } },
      ],
    }).populate("category", "name slug");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// -------------------- Get Low Stock Masala Products --------------------
export const getLowStockMasalaProducts = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 5;

    const lowStockProducts = await MasalaProduct.find({
      stockQuantity: { $lte: threshold },
    })
      .select("title stockQuantity images")
      .sort({ stockQuantity: 1 });

    res.json(lowStockProducts);
  } catch (error) {
    console.error("Error fetching low stock Masala products:", error);
    res.status(500).json({ message: "Server error" });
  }
};
