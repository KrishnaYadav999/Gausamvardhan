import AgarbattiProduct from "../models/agarbattiModel.js";
import Category from "../models/Category.js";

// -------------------- Create Agarbatti Product --------------------
export const createAgarbattiProduct = async (req, res) => {
  try {
    const { category: categoryId, packs } = req.body;

    // Check category valid
    const category = await Category.findById(categoryId);
    if (!category) return res.status(400).json({ error: "Invalid category ID" });

    // Ensure images is array
    if (req.body.images && !Array.isArray(req.body.images)) {
      req.body.images = [req.body.images];
    }

    // Ensure keyBenefits & ingredients arrays
    if (req.body.keyBenefits && !Array.isArray(req.body.keyBenefits)) {
      req.body.keyBenefits = [req.body.keyBenefits];
    }
    if (req.body.ingredients && !Array.isArray(req.body.ingredients)) {
      req.body.ingredients = [req.body.ingredients];
    }

    // Ensure packs is array of objects {name, price}
    if (packs && !Array.isArray(packs)) {
      return res.status(400).json({ error: "Packs must be an array of {name, price}" });
    }

    const product = await AgarbattiProduct.create(req.body);
    res.status(201).json(product);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// -------------------- Get All Agarbatti Products --------------------
export const getAllAgarbattiProducts = async (req, res) => {
  try {
    const products = await AgarbattiProduct.find({})
      .populate("category", "name slug");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Get Single Agarbatti Product --------------------
export const getAgarbattiProduct = async (req, res) => {
  try {
    const product = await AgarbattiProduct.findById(req.params.id)
      .populate("category", "name slug");

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Update Agarbatti Product --------------------
export const updateAgarbattiProduct = async (req, res) => {
  try {
    // Validate category if provided
    if (req.body.category) {
      const category = await Category.findById(req.body.category);
      if (!category) return res.status(400).json({ error: "Invalid category ID" });
    }

    // Fix arrays
    if (req.body.images && !Array.isArray(req.body.images)) {
      req.body.images = [req.body.images];
    }
    if (req.body.keyBenefits && !Array.isArray(req.body.keyBenefits)) {
      req.body.keyBenefits = [req.body.keyBenefits];
    }
    if (req.body.ingredients && !Array.isArray(req.body.ingredients)) {
      req.body.ingredients = [req.body.ingredients];
    }

    // Ensure packs is array of objects {name, price}
    if (req.body.packs && !Array.isArray(req.body.packs)) {
      return res.status(400).json({ error: "Packs must be an array of {name, price}" });
    }

    const product = await AgarbattiProduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// -------------------- Delete Agarbatti Product --------------------
export const deleteAgarbattiProduct = async (req, res) => {
  try {
    const product = await AgarbattiProduct.findByIdAndDelete(req.params.id);

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Get Products by Category Slug --------------------
export const getAgarbattiProductsByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ error: "Category not found" });

    const products = await AgarbattiProduct.find({ category: category._id });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Get Product by Slug + ID --------------------
export const getAgarbattiProductBySlugAndId = async (req, res) => {
  try {
    const product = await AgarbattiProduct.findById(req.params.id)
      .populate("category", "name slug");

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Add Review --------------------
export const addAgarbattiProductReview = async (req, res) => {
  try {
    const { name, rating, comment, images } = req.body;

    const product = await AgarbattiProduct.findById(req.params.id);
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
export const getSimilarAgarbattiProducts = async (req, res) => {
  try {
    const product = await AgarbattiProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const similar = await AgarbattiProduct.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(8);

    res.status(200).json(similar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Search Products --------------------
export const searchAgarbattiProducts = async (req, res) => {
  try {
    const query = req.params.query;

    const products = await AgarbattiProduct.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    }).populate("category", "name slug");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Low Stock Products --------------------
export const getLowStockAgarbattiProducts = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 5;

    const products = await AgarbattiProduct.find({
      stockQuantity: { $lte: threshold },
    })
      .select("title stockQuantity images")
      .sort({ stockQuantity: 1 });

    res.json(products);
  } catch (error) {
    console.error("Low stock error:", error);
    res.status(500).json({ message: "Server error" });
  }
};