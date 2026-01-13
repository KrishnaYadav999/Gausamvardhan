import Product from "../models/Product.js";
import Category from "../models/Category.js";

// ---------------- CREATE PRODUCT ----------------
export const createProduct = async (req, res) => {
  try {
    const { category, videoUrl, moreAboutProduct , coupons } = req.body;

    if (coupons && !Array.isArray(coupons)) {
  return res.status(400).json({ message: "coupons must be an array" });
}

    // Check if category exists
    const cat = await Category.findById(category);
    if (!cat) return res.status(404).json({ message: "Category not found" });

    // Create new product with all fields
    const product = new Product({
      ...req.body,
      stock: req.body.stock !== undefined ? req.body.stock : true, // default to true
      videoUrl: videoUrl || "",
      moreAboutProduct: Array.isArray(moreAboutProduct) ? moreAboutProduct : [],
      coupons: Array.isArray(coupons) ? coupons : [],
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

    const products = await Product.find({
      $or: [
        { stockQuantity: { $lte: threshold } },
        { stockStatus: "OUT_OF_STOCK" },
      ],
    })
      .select(
        "productName productImages stockQuantity stockStatus lastStockUpdatedAt stockHistory"
      )
      .sort({ stockQuantity: 1 });

    // 🔥 Professional response formatting
    const formattedProducts = products.map((p) => ({
      id: p._id,
      productName: p.productName,
      image: p.productImages?.[0] || "/no-image.png",

      stockQuantity: p.stockQuantity,
      stockStatus: p.stockStatus,

      lastStockUpdatedAt: p.lastStockUpdatedAt,

      // latest stock record (date + quantity)
      lastStockRecord:
        p.stockHistory && p.stockHistory.length > 0
          ? p.stockHistory[p.stockHistory.length - 1]
          : null,
    }));

    res.json({
      totalLowStockProducts: formattedProducts.length,
      threshold,
      products: formattedProducts,
    });
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const addCouponToProduct = async (req, res) => {
  try {
    const { id } = req.params; // product id
    const coupon = req.body;   // expect coupon object: { code, discountType, discountValue, isPermanent, expiryDate, usageLimit, isActive }

    if (!coupon || !coupon.code) {
      return res.status(400).json({ message: "Coupon code required" });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Optional: ensure coupon code unique per product
    const exists = product.coupons.find(
      (c) => c.code.toLowerCase() === coupon.code.toLowerCase()
    );
    if (exists) {
      return res.status(400).json({ message: "Coupon code already exists for this product" });
    }

    product.coupons.push({
      ...coupon,
      discountValue: Number(coupon.discountValue),
      usageLimit: coupon.usageLimit ? Number(coupon.usageLimit) : null,
      usedCount: 0,
      isActive: coupon.isActive !== undefined ? coupon.isActive : true,
    });

    await product.save();
    res.status(201).json({ message: "Coupon added", coupons: product.coupons });
  } catch (error) {
    console.error("addCoupon error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// PATCH /api/products/:id/coupons/:couponCode
export const updateCouponOfProduct = async (req, res) => {
  try {
    const { id, couponCode } = req.params;
    const updates = req.body; // allowed updates in body

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const idx = product.coupons.findIndex(
      (c) => c.code.toLowerCase() === couponCode.toLowerCase()
    );
    if (idx === -1) return res.status(404).json({ message: "Coupon not found" });

    const coupon = product.coupons[idx];

    // Allowed fields to update (don't allow directly setting usedCount)
    const allowed = ["discountType", "discountValue", "isPermanent", "expiryDate", "usageLimit", "isActive"];
    allowed.forEach((key) => {
      if (updates[key] !== undefined) {
        // basic normalization
        coupon[key] = key === "discountValue" || key === "usageLimit"
          ? Number(updates[key])
          : updates[key];
      }
    });

    await product.save();
    res.json({ message: "Coupon updated", coupon });
  } catch (error) {
    console.error("updateCoupon error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// DELETE /api/products/:id/coupons/:couponCode
export const deleteCouponOfProduct = async (req, res) => {
  try {
    const { id, couponCode } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const beforeCount = product.coupons.length;
    product.coupons = product.coupons.filter(
      (c) => c.code.toLowerCase() !== couponCode.toLowerCase()
    );

    if (product.coupons.length === beforeCount) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    await product.save();
    res.json({ message: "Coupon deleted", coupons: product.coupons });
  } catch (error) {
    console.error("deleteCoupon error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// POST /api/products/:id/apply-coupon
export const applyCoupon = async (req, res) => {
  try {
    const { id } = req.params; // product id
    const { code, quantity = 1 } = req.body;

    if (!code) return res.status(400).json({ message: "Coupon code required" });

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const coupon = product.coupons.find((c) => c.code.toLowerCase() === code.toLowerCase());
    if (!coupon) return res.status(404).json({ message: "Coupon not found for this product" });

    if (!coupon.isActive) return res.status(400).json({ message: "Coupon inactive" });

    // expiry check
    if (!coupon.isPermanent && coupon.expiryDate) {
      const now = new Date();
      if (now > new Date(coupon.expiryDate)) {
        return res.status(400).json({ message: "Coupon expired" });
      }
    }

    // usage limit check
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
    }

    // calculate
    const price = Number(product.currentPrice) || 0;
    const qty = Math.max(1, Number(quantity) || 1);
    let discountAmount = 0;

    if (coupon.discountType === "percentage") {
      discountAmount = (price * qty) * (Number(coupon.discountValue) / 100);
    } else { // flat
      // Treat flat as total discount (you can change to per-unit if wanted)
      discountAmount = Number(coupon.discountValue);
    }

    let finalPrice = (price * qty) - discountAmount;
    if (finalPrice < 0) finalPrice = 0;

    // increment usedCount then save (non-atomic)
    coupon.usedCount = (coupon.usedCount || 0) + 1;
    await product.save();

    res.json({
      message: "Coupon applied",
      code: coupon.code,
      discountAmount,
      finalPrice,
      originalTotal: price * qty,
    });
  } catch (error) {
    console.error("applyCoupon error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
