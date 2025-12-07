import axios from "axios";
import qs from "qs";

export const sendOrderToDelhivery = async (order) => {
  try {
    console.log("== RAW ORDER RECEIVED ==");
    console.log(JSON.stringify(order, null, 2));

    // -----------------------------
    // TOTAL QUANTITY
    // -----------------------------
    const totalQty = order.products.reduce(
      (acc, p) => acc + (p.quantity || 1),
      0
    );

    // -----------------------------
    // TOTAL PRICE (Declared Value)
    // -----------------------------
    const totalPrice = order.products.reduce(
      (acc, p) => acc + (p.quantity || 1) * (p.price || 0),
      0
    );

    const declaredValue = Math.round(totalPrice);

    console.log("➡ TOTAL QTY:", totalQty);
    console.log("➡ TOTAL PRICE:", totalPrice);
    console.log("➡ DECLARED VALUE:", declaredValue);

    // -----------------------------
    // PRODUCT DEBUGGING
    // -----------------------------
    const delhiveryProducts = order.products.map((p) => {
      const obj = {
        name: p.name || "Unnamed Product",
        qty: p.quantity || 1,
        price: p.price || 0,
        total: (p.quantity || 1) * (p.price || 0),
      };

      console.log("➡ PRODUCT SENT TO DELHIVERY:", obj);
      return obj;
    });

    // -----------------------------
    // CLEAN ADDRESS
    // -----------------------------
    const cleanAddress = order.shippingAddress.address
      .replace(/\r?\n|\r/g, " ")
      .trim();

    // -----------------------------
    // PRODUCT DETAILS STRING
    // -----------------------------
    const productDetails = order.products
      .map((p) => `${p.name} | ${p.quantity} Qty | ₹${p.price}`)
      .join(", ");

    // -----------------------------
    // BUYER EMAIL FIX
    // -----------------------------
    const buyerEmail =
      order.userEmail ||
      order.shippingAddress.email ||
      "noemail@fallback.com";

    console.log("➡ BUYER EMAIL:", buyerEmail);

    // --------------------------------------------
    // *** PRICE VISIBLE FIX (COD TRICK) ***
    // --------------------------------------------
    const paymentMode = "COD"; // always COD so Delhivery shows price
    const codAmount = declaredValue; // show actual ₹ price

    // -----------------------------
    // FINAL SHIPMENT OBJECT
    // -----------------------------
    const shipment = {
      // Buyer Details
      name: order.shippingAddress.name,
      add: cleanAddress,
      address2: "",
      address3: "",
      city: order.shippingAddress.city,
      state: order.shippingAddress.state,
      pin: String(order.shippingAddress.pincode),
      phone: String(order.shippingAddress.phone),
      email: String(buyerEmail),
      country: "IN",

      order: order.orderNumber,

      // Payment (COD trick)
      payment_mode: paymentMode,
      quantity: totalQty,
      declared_value: declaredValue,

      // Product Details
      products_desc: order.products.map((p) => p.name).join(", "),
      products: delhiveryProducts,
      product_details: productDetails,

      // Weight (convert "250g" → 250)
      weight: order.products.reduce((t, p) => {
        if (!p.weight) return t + 250; // default 250 gram
        const numericWeight = parseFloat(p.weight.replace(/[^0-9]/g, ""));
        return t + (numericWeight || 250);
      }, 0),

      // COD amount shown on Delhivery panel
      cod_amount: codAmount,

      // Seller Details
      seller_name: "Mangesh Gound",
      seller_add:
        "SHRUSTHI,AMBERNATH THANE,MAHRASHTRA-421503 BLDG NO. A-18 FLAT NO:303",
      seller_city: "Ambernath",
      seller_state: "Maharashtra",
      seller_pin: "421503",
      seller_phone: "8097675222",

      // Return Address
      return_address:
        "SHRUSTHI,AMBERNATH THANE,MAHRASHTRA-421503 BLDG NO. A-18 FLAT NO:303",
      return_city: "Mumbai",
      return_state: "Maharashtra",
      return_pin: "421503",
      return_phone: "8097675222",

      // -----------------------------
      // PICKUP LOCATION
      // -----------------------------
      pickup_location: "SHRUSTHI,AMBERNATH THANE,MAHRASHTRA-421503 BLDG NO. A-18 FLAT NO:303",
    };

    console.log("== FINAL SHIPMENT SENT TO DELHIVERY ==");
    console.log(JSON.stringify(shipment, null, 2));

    // -----------------------------
    // PAYLOAD
    // -----------------------------
    const payload = {
      format: "json",
      data: JSON.stringify({ shipments: [shipment] }),
    };

    console.log("== PAYLOAD SENT TO DELHIVERY ==");
    console.log(JSON.stringify(payload, null, 2));

    // -----------------------------
    // API CALL
    // -----------------------------
    const res = await axios.post(
      "https://track.delhivery.com/api/cmu/create.json",
      qs.stringify(payload),
      {
        headers: {
          Authorization: `Token ${process.env.DELHIVERY_API_TOKEN}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("== DELHIVERY RESPONSE RECEIVED ==");
    console.log(JSON.stringify(res.data, null, 2));

    return res.data;

  } catch (err) {
    console.error("❌ Delhivery API Error:", err.response?.data || err.message);
    return null;
  }
};
