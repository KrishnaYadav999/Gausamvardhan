import AgarbattiProduct from "../models/agarbattiModel.js";
import Category from "../models/Category.js";

// -------------------- Create Agarbatti Product --------------------
export const createAgarbattiProduct = async (req, res) => {
  try {
    const { category: categoryId, packs, moreAboutProduct,coupons  } = req.body;
console.log("Processed request body before DB save:", JSON.stringify(req.body, null, 2));

    // Validate category
    const category = await Category.findById(categoryId);
    if (!category) return res.status(400).json({ error: "Invalid category ID" });

    // Fix images array
    if (req.body.images && !Array.isArray(req.body.images)) {
      req.body.images = [req.body.images];
    }

    // Fix keyBenefits & ingredients array
    if (req.body.keyBenefits && !Array.isArray(req.body.keyBenefits)) {
      req.body.keyBenefits = [req.body.keyBenefits];
    }
    if (req.body.ingredients && !Array.isArray(req.body.ingredients)) {
      req.body.ingredients = [req.body.ingredients];
    }

    // Fix packs array
    if (packs && !Array.isArray(packs)) {
      return res.status(400).json({ error: "Packs must be an array" });
    }

    // Fix moreAboutProduct images
    if (moreAboutProduct?.images && !Array.isArray(moreAboutProduct.images)) {
      req.body.moreAboutProduct.images = [moreAboutProduct.images];
    }

    // 🔥 FIX: Ensure cut_price & current_price are numbers
    if (req.body.cut_price) req.body.cut_price = Number(req.body.cut_price);
    if (req.body.current_price) req.body.current_price = Number(req.body.current_price);
    
   if (coupons) {
      if (!Array.isArray(coupons)) return res.status(400).json({ error: "Coupons must be an array" });
      
      // If objects are sent, store _id if exists, or value
      req.body.coupons = coupons.map(c => c._id ? c._id : c);
    }

    const product = await AgarbattiProduct.create(req.body);
    res.status(201).json(product);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// -------------------- Update Agarbatti Product --------------------
export const updateAgarbattiProduct = async (req, res) => {
  try {
    // Validate category
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
    if (req.body.packs && !Array.isArray(req.body.packs)) {
      return res.status(400).json({ error: "Packs must be an array" });
    }

    // Fix moreAboutProduct images
    if (req.body.moreAboutProduct?.images && !Array.isArray(req.body.moreAboutProduct.images)) {
      req.body.moreAboutProduct.images = [req.body.moreAboutProduct.images];
    }

    // 🔥 FIX: Convert prices to numbers
    if (req.body.cut_price) req.body.cut_price = Number(req.body.cut_price);
    if (req.body.current_price) req.body.current_price = Number(req.body.current_price);

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

// -------------------- Get All --------------------
export const getAllAgarbattiProducts = async (req, res) => {
  try {
    const products = await AgarbattiProduct.find({})
      .populate("category", "name slug");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Get Single --------------------
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

// -------------------- Delete --------------------
export const deleteAgarbattiProduct = async (req, res) => {
  try {
    const product = await AgarbattiProduct.findByIdAndDelete(req.params.id);

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Category Wise --------------------
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

// -------------------- Slug + ID --------------------
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

    const total = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    product.rating = (total / product.reviews.length).toFixed(1);

    await product.save();
    res.status(201).json(product);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// -------------------- Similar --------------------
export const getSimilarAgarbattiProducts = async (req, res) => {
  try {
    const product = await AgarbattiProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const similar = await AgarbattiProduct.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(8);

    res.status(200).json(similar);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Search --------------------
export const searchAgarbattiProducts = async (req, res) => {
  try {
    const query = req.params.query;

    const products = await AgarbattiProduct.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } }
      ]
    }).populate("category", "name slug");

    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Low Stock --------------------
export const getLowStockAgarbattiProducts = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 5;

    const products = await AgarbattiProduct.find({
      stockQuantity: { $lte: threshold }
    }).select("title stockQuantity images").sort({ stockQuantity: 1 });

    res.json(products);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const addCouponToAgarbattiProduct = async (req, res) => {
  try {
    const { id } = req.params; // product id
    const { couponId } = req.body;

    // Validate product
    const product = await AgarbattiProduct.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Validate coupon
    const coupon = await Coupon.findById(couponId);
    if (!coupon) return res.status(400).json({ error: "Invalid coupon ID" });

    // Check if coupon already exists
    const exists = product.coupons.includes(couponId);
    if (exists) {
      return res.status(400).json({ error: "Coupon already added" });
    }

    product.coupons.push(couponId);
    await product.save();

    res.status(200).json({
      message: "Coupon added successfully",
      product,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ----------------------------------------------------
   UPDATE A SPECIFIC COUPON OF AGARBATTI
-----------------------------------------------------*/
export const updateCouponOfAgarbattiProduct = async (req, res) => {
  try {
    const { id, couponId } = req.params;

    // Validate product
    const product = await AgarbattiProduct.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Validate coupon exists in product
    const index = product.coupons.indexOf(couponId);
    if (index === -1) {
      return res.status(404).json({ error: "Coupon not found in product" });
    }

    // Update coupon details
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      couponId,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: "Coupon updated successfully",
      coupon: updatedCoupon,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ----------------------------------------------------
   DELETE COUPON FROM AGARBATTI PRODUCT
-----------------------------------------------------*/
export const deleteCouponOfAgarbattiProduct = async (req, res) => {
  try {
    const { id, couponId } = req.params;

    const product = await AgarbattiProduct.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Remove coupon
    product.coupons = product.coupons.filter(
      (coupon) => coupon.toString() !== couponId
    );

    await product.save();

    res.status(200).json({
      message: "Coupon removed successfully",
      product,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
