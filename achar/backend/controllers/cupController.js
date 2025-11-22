import CupProduct from "../models/cupModel.js";
import Category from "../models/Category.js";

// Helper to convert fields to arrays
const fixArray = (body, field) => {
  if (body[field] && !Array.isArray(body[field])) {
    body[field] = [body[field]];
  }
};

// -------------------- Create Cup Product --------------------
export const createCupProduct = async (req, res) => {
  try {
    const { category: categoryId } = req.body;

    // Validate category
    const category = await Category.findById(categoryId);
    if (!category) return res.status(400).json({ error: "Invalid category ID" });

    // Fix standard arrays
    fixArray(req.body, "images");
    fixArray(req.body, "keyBenefits");
    fixArray(req.body, "ingredients");
    fixArray(req.body, "packs");

    // ⭐ FIX moreAboutProduct
    if (!req.body.moreAboutProduct) {
      req.body.moreAboutProduct = {
        name: "",
        description: "",
        images: []
      };
    } else {
      // Fix images
      if (req.body.moreAboutProduct.images) {
        if (!Array.isArray(req.body.moreAboutProduct.images)) {
          req.body.moreAboutProduct.images = [req.body.moreAboutProduct.images];
        }
      } else {
        req.body.moreAboutProduct.images = [];
      }
    }

    const product = await CupProduct.create(req.body);
    res.status(201).json(product);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// -------------------- Get All Cup Products --------------------
export const getAllCupProducts = async (req, res) => {
  try {
    const products = await CupProduct.find({}).populate("category", "name slug");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Get Single Cup Product --------------------
export const getCupProduct = async (req, res) => {
  try {
    const product = await CupProduct.findById(req.params.id).populate("category", "name slug");
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Update Cup Product --------------------
export const updateCupProduct = async (req, res) => {
  try {
    const { category, moreAboutProduct } = req.body;

    // Validate category if updating
    if (category) {
      const categoryExist = await Category.findById(category);
      if (!categoryExist) return res.status(400).json({ error: "Invalid category ID" });
    }

    // Fix arrays
    fixArray(req.body, "images");
    fixArray(req.body, "keyBenefits");
    fixArray(req.body, "ingredients");
    fixArray(req.body, "packs");

    // ⭐ FIX moreAboutProduct
    if (!req.body.moreAboutProduct) {
      req.body.moreAboutProduct = {
        name: "",
        description: "",
        images: []
      };
    } else {
      if (moreAboutProduct.images) {
        if (!Array.isArray(moreAboutProduct.images)) {
          req.body.moreAboutProduct.images = [moreAboutProduct.images];
        }
      } else {
        req.body.moreAboutProduct.images = [];
      }
    }

    const product = await CupProduct.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.status(200).json(product);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// -------------------- Delete Cup Product --------------------
export const deleteCupProduct = async (req, res) => {
  try {
    const product = await CupProduct.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Get Products by Category Slug --------------------
export const getCupProductsByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ error: "Category not found" });

    const products = await CupProduct.find({ category: category._id });
    res.json(products);
  } catch (error) {
    console.error("Cup Category Fetch Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Get Product by Slug + ID --------------------
export const getCupProductBySlugAndId = async (req, res) => {
  try {
    const product = await CupProduct.findById(req.params.id).populate("category", "name slug");
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Add Review --------------------
export const addCupProductReview = async (req, res) => {
  try {
    const { name, rating, comment, images } = req.body;

    const product = await CupProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const newReview = { name, rating, comment, images };
    product.reviews.push(newReview);

    // Update average rating
    const total = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    product.rating = (total / product.reviews.length).toFixed(1);

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// -------------------- Get Similar Products --------------------
export const getSimilarCupProducts = async (req, res) => {
  try {
    const product = await CupProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const similar = await CupProduct.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(8);

    res.status(200).json(similar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Search Cup Products --------------------
export const searchCupProducts = async (req, res) => {
  try {
    const query = req.params.query;

    const products = await CupProduct.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } }
      ],
    }).populate("category", "name slug");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Low Stock Products --------------------
export const getLowStockCupProducts = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 5;

    const products = await CupProduct.find({ stockQuantity: { $lte: threshold } })
      .select("title stockQuantity images")
      .sort({ stockQuantity: 1 });

    res.json(products);
  } catch (error) {
    console.error("Low stock error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
