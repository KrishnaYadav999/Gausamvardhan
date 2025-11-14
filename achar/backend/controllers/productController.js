import Product from "../models/Product.js";
import Category from "../models/Category.js";

// ---------------- CREATE PRODUCT ----------------
export const createProduct = async (req, res) => {
  try {
    const { category, videoUrl, moreAboutProduct } = req.body;

    // Check if category exists
    const cat = await Category.findById(category);
    if (!cat) return res.status(404).json({ message: "Category not found" });

    // Create new product with all fields
    const product = new Product({
      ...req.body,
      stock: req.body.stock !== undefined ? req.body.stock : true, // default to true
      videoUrl: videoUrl || "",
      moreAboutProduct: Array.isArray(moreAboutProduct) ? moreAboutProduct : [],
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ---------------- GET ALL PRODUCTS ----------------
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name slug");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- GET PRODUCTS BY CATEGORY SLUG ----------------
export const getProductsByCategorySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });
    if (!category) return res.status(404).json({ message: "Category not found" });

    const products = await Product.find({ category: category._id }).populate(
      "category",
      "name slug"
    );
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- GET PRODUCT BY SLUG & ID ----------------
export const getProductBySlugAndId = async (req, res) => {
  try {
    const { slug, id } = req.params;
    const category = await Category.findOne({ slug });
    if (!category) return res.status(404).json({ message: "Category not found" });

    const product = await Product.findOne({
      _id: id,
      category: category._id,
    }).populate("category", "name slug");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- UPDATE PRODUCT ----------------
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { videoUrl, moreAboutProduct } = req.body;

    Object.keys(req.body).forEach((key) => {
      product[key] = req.body[key];
    });

    if (videoUrl !== undefined) product.videoUrl = videoUrl;
    if (Array.isArray(moreAboutProduct)) product.moreAboutProduct = moreAboutProduct;

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ---------------- DELETE PRODUCT ----------------
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "✅ Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- ADD REVIEW TO PRODUCT ----------------
export const addReview = async (req, res) => {
  const { id } = req.params;
  const { name, rating, comment, images } = req.body;

  if (!name || !rating || !comment) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const newReview = {
      name,
      rating: Number(rating),
      comment,
      images: images || [],
      createdAt: new Date(),
    };

    product.reviews.push(newReview);

    // Update average rating & number of reviews
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = totalRating / product.reviews.length;
    product.numberOfReviews = product.reviews.length;

    await product.save();

    res.status(201).json({ message: "Review added", review: newReview });
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- DELETE REVIEW ----------------
export const deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== reviewId
    );
    await product.calculateAverageRating();

    res.json({ message: "✅ Review deleted successfully", product });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ---------------- GET SIMILAR PRODUCTS ----------------
export const getSimilarProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const similarProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    })
      .limit(6)
      .populate("category", "name slug");

    res.json(similarProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------- SEARCH PRODUCTS BY NAME ----------------
export const searchProductsByName = async (req, res) => {
  try {
    const { query } = req.params;

    const products = await Product.find({
      productName: { $regex: query, $options: "i" }, // case-insensitive
    }).populate("category", "name slug");

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getLowStockProducts = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 5;

    const lowStockProducts = await Product.find({
      stockQuantity: { $lte: threshold },
    })
      .select("productName stockQuantity productImages")
      .sort({ stockQuantity: 1 });

    res.json(lowStockProducts);
  } catch (error) {
    console.error("Error fetching low stock Achar products:", error);
    res.status(500).json({ message: "Server error" });
  }
};
