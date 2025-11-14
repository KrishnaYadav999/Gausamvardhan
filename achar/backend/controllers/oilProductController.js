import OilProduct from "../models/oilProductModel.js";
import Category from "../models/Category.js";
// ---------------- Create Product ----------------
export const createOilProduct = async (req, res) => {
  try {
    // If perPriceLiter comes as string "1L=499,5L=1000,10L=2000", convert to array
    if (req.body.perPriceLiter && typeof req.body.perPriceLiter === "string") {
      req.body.perPriceLiter = req.body.perPriceLiter.split(",").map(item => {
        const [volume, price] = item.split("=").map(s => s.trim());
        return { volume, price: Number(price) };
      });
    }
 if (!req.body.stockQuantity) req.body.stockQuantity = 0;
    const product = new OilProduct(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// ---------------- Get All Products ----------------
export const getOilProducts = async (req, res) => {
  try {
    const products = await OilProduct.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- Get Product by ID ----------------
export const getOilProductById = async (req, res) => {
  try {
    const product = await OilProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- Get Product by Slug & ID ----------------
export const getOilProductBySlugAndId = async (req, res) => {
  try {
    const product = await OilProduct.findOne({
      _id: req.params.id,
      slug: req.params.slug,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- Update Product ----------------
export const updateOilProduct = async (req, res) => {
  try {
    if (req.body.perPriceLiter && typeof req.body.perPriceLiter === "string") {
      req.body.perPriceLiter = req.body.perPriceLiter.split(",").map(item => {
        const [volume, price] = item.split("=").map(s => s.trim());
        return { volume, price: Number(price) };
      });
    }

    const product = await OilProduct.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ---------------- Delete Product ----------------
export const deleteOilProduct = async (req, res) => {
  try {
    const product = await OilProduct.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- Add Review ----------------
export const addOilReview = async (req, res) => {
  try {
    const product = await OilProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.reviews.push(req.body);
    await product.calculateAverageRating();
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ---------------- Delete Review ----------------
export const deleteOilReview = async (req, res) => {
  try {
    const product = await OilProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.reviews = product.reviews.filter(r => r._id.toString() !== req.params.reviewId);
    await product.calculateAverageRating();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- Get Similar Products ----------------
export const getSimilarOilProducts = async (req, res) => {
  try {
    const product = await OilProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const similarProducts = await OilProduct.find({
      _id: { $ne: product._id },
      category: product.category,
    }).limit(5);

    res.json(similarProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOilProductsByCategory = async (req, res) => {
  try {
    // 1️⃣ Find category by slug
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: "Category not found" });

    // 2️⃣ Find all oil products with that category ObjectId
    const products = await OilProduct.find({ category: category._id });
    res.json(products);
  } catch (error) {
    console.error("Error in getOilProductsByCategory:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// -------------------- Search Oil Products --------------------
export const searchOilProducts = async (req, res) => {
  try {
    const { query } = req.params;

    // Search by productName or description (case-insensitive)
    const products = await OilProduct.find({
      $or: [
        { productName: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    }).limit(20); // Optional: limit results

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Search failed", error: error.message });
  }
};




// controllers/oilController.js
export const getLowStockOilProducts = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 5;
    console.log("🔹 Threshold received:", threshold);

    const allProducts = await OilProduct.find()
      .select("productName stockQuantity productImages")
      .sort({ stockQuantity: 1 });



    const lowStockProducts = allProducts.filter(p => p.stockQuantity <= threshold);
   

    res.json(lowStockProducts);
  } catch (error) {
    console.error("💥 Error in getLowStockOilProducts:", error);
    res.status(500).json({ message: "Server error" });
  }
};
