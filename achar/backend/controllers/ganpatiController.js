// ---------------- IMPORTS ----------------
import GanpatiProduct from "../models/ganpatimodel.js";
import Category from "../models/Category.js";
import slugify from "slugify";

// -------------------- Create Ganpati Product --------------------
export const createGanpatiProduct = async (req, res) => {
  try {
    const {
      category: categoryId,
      moreAboutProduct,
      packs,
      images,
      keyBenefits,
      ingredients,
      cutPrice,
      currentPrice,
      title,
      description,
      quantity,
      stock,
      stockQuantity,
      videoUrl,
      rating,
      reviews,
         coupons,  
    } = req.body;

    // Validate category
    const category = await Category.findById(categoryId);
    if (!category)
      return res.status(400).json({ error: "Invalid category ID" });

    // Convert single values into arrays
    const imagesArray = Array.isArray(images) ? images : images ? [images] : [];
    const keyBenefitsArray = Array.isArray(keyBenefits) ? keyBenefits : keyBenefits ? [keyBenefits] : [];
    const ingredientsArray = Array.isArray(ingredients) ? ingredients : ingredients ? [ingredients] : [];
    const packsArray = Array.isArray(packs) ? packs : packs ? [packs] : [];
    const reviewsArray = Array.isArray(reviews)
      ? reviews.map(r => ({
          name: r.name || "Anonymous",
          rating: Number(r.rating) || 0,
          comment: r.comment || "",
          images: Array.isArray(r.images) ? r.images : [],
        }))
      : [];

    const moreAbout = {
      name: moreAboutProduct?.name || "",
      description: moreAboutProduct?.description || "",
      images: Array.isArray(moreAboutProduct?.images)
        ? moreAboutProduct.images
        : moreAboutProduct?.images
        ? [moreAboutProduct.images]
        : [],
    };
   const couponsArray = Array.isArray(coupons) ? coupons : []; 
    // Generate unique slug
    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    while (await GanpatiProduct.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Calculate average rating if reviews exist
    const avgRating = reviewsArray.length
      ? (reviewsArray.reduce((acc, r) => acc + r.rating, 0) / reviewsArray.length).toFixed(1)
      : Number(rating) || 0;

    const product = await GanpatiProduct.create({
      title,
      description,
      keyBenefits: keyBenefitsArray,
      ingredients: ingredientsArray,
      quantity: quantity || "",
      stock: stock !== undefined ? stock : true,
      stockQuantity: stockQuantity || 0,
      category: categoryId,
      images: imagesArray,
      packs: packsArray,
      cut_price: cutPrice || null,
      current_price: currentPrice || null,
      videoUrl: videoUrl || "",
      rating: avgRating,
      reviews: reviewsArray,
      moreAboutProduct: moreAbout,
      slug,
      coupons: couponsArray, 
    });

    res.status(201).json(product);
  } catch (error) {
    console.log("CREATE ERROR → ", error);
    res.status(400).json({ error: error.message });
  }
};

// -------------------- Get All Ganpati Products --------------------
export const getAllGanpatiProducts = async (req, res) => {
  try {
    const products = await GanpatiProduct.find({}).populate("category", "name slug");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Get Single Product --------------------
export const getGanpatiProduct = async (req, res) => {
  try {
    const product = await GanpatiProduct.findById(req.params.id).populate("category", "name slug");
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Update Ganpati Product --------------------
export const updateGanpatiProduct = async (req, res) => {
  try {
    // Validate category if provided
    if (req.body.category) {
      const category = await Category.findById(req.body.category);
      if (!category)
        return res.status(400).json({ error: "Invalid category ID" });
    }

    // Convert single values to arrays
    if (req.body.images && !Array.isArray(req.body.images))
      req.body.images = [req.body.images];

    if (req.body.keyBenefits && !Array.isArray(req.body.keyBenefits))
      req.body.keyBenefits = [req.body.keyBenefits];

    if (req.body.ingredients && !Array.isArray(req.body.ingredients))
      req.body.ingredients = [req.body.ingredients];

    if (req.body.packs && !Array.isArray(req.body.packs))
      return res
        .status(400)
        .json({ error: "Packs must be an array of {name, price}" });

    if (
      req.body.moreAboutProduct?.images &&
      !Array.isArray(req.body.moreAboutProduct.images)
    ) {
      req.body.moreAboutProduct.images = [req.body.moreAboutProduct.images];
    }

    // PRICE mapping
    if (req.body.cutPrice !== undefined)
      req.body.cut_price = req.body.cutPrice;

    if (req.body.currentPrice !== undefined)
      req.body.current_price = req.body.currentPrice;

    // REGENERATE SLUG if title changes
    if (req.body.title) {
      const baseSlug = slugify(req.body.title, { lower: true, strict: true });
      let newSlug = baseSlug;
      let counter = 1;

      while (
        await GanpatiProduct.findOne({
          slug: newSlug,
          _id: { $ne: req.params.id },
        })
      ) {
        newSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      req.body.slug = newSlug;
    }

    // ------------------ COUPON LOGIC ------------------
    if (req.body.coupon) {
      const coupon = await Coupon.findById(req.body.coupon);

      if (!coupon)
        return res.status(400).json({ error: "Invalid coupon ID" });

      req.body.coupon = coupon._id;
    }

    // ------------------ REVIEWS ------------------
    if (req.body.reviews && Array.isArray(req.body.reviews)) {
      req.body.reviews = req.body.reviews.map((r) => ({
        name: r.name || "Anonymous",
        rating: Number(r.rating) || 0,
        comment: r.comment || "",
        images: Array.isArray(r.images) ? r.images : [],
      }));

      const total = req.body.reviews.reduce((acc, r) => acc + r.rating, 0);
      req.body.rating = (total / req.body.reviews.length).toFixed(1);
    }

    // ------------------ UPDATE PRODUCT ------------------
    const product = await GanpatiProduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product)
      return res.status(404).json({ error: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// -------------------- Delete Ganpati Product --------------------
export const deleteGanpatiProduct = async (req, res) => {
  try {
    const product = await GanpatiProduct.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Get Products by Category Slug --------------------
export const getGanpatiProductsByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ error: "Category not found" });

    const products = await GanpatiProduct.find({ category: category._id });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Get Product by Slug + ID --------------------
export const getGanpatiProductBySlugAndId = async (req, res) => {
  try {
    const product = await GanpatiProduct.findById(req.params.id).populate("category", "name slug");
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Add Review --------------------
export const addGanpatiProductReview = async (req, res) => {
  try {
    const { name, rating, comment, images } = req.body;
    const product = await GanpatiProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const newReview = { name, rating: Number(rating), comment, images: images || [] };
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

// -------------------- Similar Products --------------------
export const getSimilarGanpatiProducts = async (req, res) => {
  try {
    const product = await GanpatiProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const similar = await GanpatiProduct.find({ category: product.category, _id: { $ne: product._id } }).limit(8);
    res.status(200).json(similar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Search --------------------
export const searchGanpatiProducts = async (req, res) => {
  try {
    const query = req.params.query;
    const products = await GanpatiProduct.find({
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

// -------------------- Low Stock --------------------
export const getLowStockGanpatiProducts = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 5;

    const products = await GanpatiProduct.find({ stockQuantity: { $lte: threshold } })
      .select("title stockQuantity images")
      .sort({ stockQuantity: 1 });

    res.json(products);
  } catch (error) {
    console.error("Low stock error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// -------------------- Add Coupon --------------------
export const addCouponToGanpatiProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const couponData = req.body;

    const product = await GanpatiProduct.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.coupons.push(couponData);
    await product.save();

    res.status(201).json({
      message: "🎉 Coupon added successfully!",
      coupons: product.coupons,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------- Update Coupon --------------------
export const updateCouponOfGanpatiProduct = async (req, res) => {
  try {
    const { id, couponId } = req.params;
    const updateData = req.body;

    const product = await GanpatiProduct.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const coupon = product.coupons.id(couponId);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    Object.assign(coupon, updateData);
    await product.save();

    res.json({
      message: "🔄 Coupon updated successfully",
      coupons: product.coupons,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------- Delete Coupon --------------------
export const deleteCouponOfGanpatiProduct = async (req, res) => {
  try {
    const { id, couponId } = req.params;

    const product = await GanpatiProduct.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const coupon = product.coupons.id(couponId);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    coupon.remove();
    await product.save();

    res.json({
      message: "🗑️ Coupon deleted successfully",
      coupons: product.coupons,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
