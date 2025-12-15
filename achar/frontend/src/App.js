import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import SignIn from "./components/SignIn";
import LoginFlow from "./components/LoginFlow";
import AnimatedText from "./components/AnimatedText";
import ProfileDashboard from "./components/ProfileDashboard";
import AcharBanner from "./components/AcharBanner";
import AdminProtected from "./components/AdminProtected";
import AdminProtectWorker from "./Admin/AdminProtectWorker";
import AcharBannerTwo from "./components/AcharBannerTwo";
import Category from "./components/Category";
import CategoryProducts from "./components/CategoryProducts";
import GheeCategoryProduct from "./components/GheeCategoryProduct";
import AcharProductDetail from "./components/acharProductdetail";
import AddToCart from "./components/AddToCart";
import { Toaster } from "react-hot-toast";
import GheeProductDetail from "./components/GheeProductDetail";
import AcharProductList from "./components/AcharProductList";
import GheeProductList from "./components/GheeProductList";
import Footer from "./components/Footer";
import MasalaCategoryProduct from "./components/MasalaCategoryProduct";
import MasalaProductDetail from "./components/MasalaProductDetail";
// import MasalaProductList from "./components/MasalaProductList";
import Ads from "./components/Ads";
import NavbarDropdown from "./components/NavbarDropdown";
import Chat from "./components/Chat";
import OilCategoryProduct from "./components/OilCategoryProduct";
import OilProductDetail from "./components/OilProductDetail";
import ServicesNav from "./components/ServicesNav";
import ScrollToTop from "./components/ScrollToTop";
import SmoothScroll from "./components/SmoothScroll";
// import OilProductList from "./components/OilProductList";
import ProceedToCheckout from "./components/ProceedToCheckout";
import Invoice from "./components/Invoice";
import OrderTracking from "./components/OrderTracking";

//seo
import { Helmet } from "react-helmet-async";

// Support Pages
import FAQs from "./components/FAQs";
import ShippingReturns from "./components/ShippingReturns";
import PrivacyPolicy from "./components/PrivacyPolicy";
import ContactUs from "./components/ContactUs";

// ✅ ThemeProvider
import { ThemeProvider } from "./context/ThemeContext";
import VideoAdvertiseList from "./components/VideoAdvertiseList";
import AgarbattiCategoryProduct from "./components/AgarbattiCategoryProduct";
import AgarbattiDetail from "./components/AgarbattiDetail";
import AgarbattiProductList from "./components/AgarbattiProductList";
import GanpatiCategoryProduct from "./components/GanpatiCategoryProduct";
import GanpatiDetail from "./components/GanpatiDetail";
import GanpatiProductList from "./components/GanpatiProductList";
import AboutUS from "./components/AboutUS";
import Products from "./components/Products";
import Developer from "./components/Developer";
import HomeCertificates from "./components/HomeCertificates";
import GausamvardhanOrganicHandcrafted from "./components/GausamvardhanOrganicHandcrafted";
import JoinCollective from "./components/JoinCollective";
import BeyondProducts from "./components/BeyondProducts";
import AllProduct from "./components/AllProduct";
// import CupCategoryProduct from "./components/CupCategoryProduct";
// import CupDetail from "./components/CupDetail";
// import CupProductList from "./components/CupProductList";

function App() {
  return (
   <>
  <Helmet>
  {/* =========================
       PRIMARY TITLE
  ========================== */}
  <title>
    Buy Homemade Achar, Pure Desi Ghee, Ganpati Murti, Agarbatti & Pooja Samagri Online | Gausamvardhan
  </title>

  {/* =========================
       META DESCRIPTION
  ========================== */}
  <meta
    name="description"
    content="Shop authentic homemade achar, pure desi cow ghee, ganpati murti, cow dung products, agarbatti, dhoop cups, masala & pooja essentials online at Gausamvardhan. Traditional recipes, no chemicals, no preservatives. Haldi mirchi amla adrak achar, lal mirchi bharwa achar, mango pickle, kathal ka achar, lemon chili pickle, amla murabba & more."
  />

  {/* =========================
       CANONICAL URL
  ========================== */}
  <link rel="canonical" href="https://www.gausamvardhan.com/" />

  {/* =========================
       OPEN GRAPH (FB / WhatsApp)
  ========================== */}
  <meta property="og:title" content="Homemade Achar, Pure Ghee & Pooja Essentials – Gausamvardhan" />
  <meta
    property="og:description"
    content="Buy traditional homemade achar, pure cow ghee, ganpati murti, cow dung dhoop, agarbatti & pooja essentials. Authentic village-style products made with love."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://www.gausamvardhan.com/" />
  <meta property="og:site_name" content="Gausamvardhan" />
  <meta property="og:image" content="https://www.gausamvardhan.com/images/og-main.jpg" />

  {/* =========================
       TWITTER CARD
  ========================== */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Homemade Achar & Pure Desi Products Online | Gausamvardhan" />
  <meta
    name="twitter:description"
    content="Shop homemade achar, pure cow ghee, ganpati murti, cow dung dhoop, agarbatti & pooja samagri online."
  />
  <meta name="twitter:image" content="https://www.gausamvardhan.com/images/og-main.jpg" />
  <meta name="twitter:site" content="@gausamvardhan" />

  {/* =========================
      ROBOTS
  ========================== */}
  <meta name="robots" content="index, follow, max-image-preview:large" />

  {/* =========================
       MASTER KEYWORDS (PRO LEVEL)
  ========================== */}
  <meta
    name="keywords"
    content="
    homemade achar, traditional indian pickle, desi achar online,
    haldi mirchi amla adrak achar,
    lal mirchi bharwa achar,
    sukha aam ka achar,
    lasun adrak mirchi achar,
    jackfruit pickle, kathal ka achar,
    lemon chili pickle, nimbu mirchi achar,
    amla murabba achar,

    pure desi ghee, a2 cow ghee, organic ghee online,
    cow dung dhoop, gomay dhoop, cow dung products,
    agarbatti sticks, herbal agarbatti, dhoop cups,
    pooja essentials online, pooja samagri store,
    ganpati murti online, eco friendly ganesh murti,

    no preservative pickle, chemical free achar,
    village style achar, maa ke haath ka achar,
    handmade pickles india, ayurvedic achar,

    घर का बना अचार, देसी अचार,
    हल्दी मिर्च अचार, लाल मिर्च भरवा अचार,
    आम का सूखा अचार, कटहल का अचार,
    नींबू मिर्च का अचार, आंवला मुरब्बा,
    शुद्ध देसी घी, गोबर धूप, पूजा सामग्री,
    अगरबत्ती, गणपति मूर्ति,

    gausamvardhan products, organic indian products
    "
  />

  {/* =========================
       GEO TARGETING (INDIA)
  ========================== */}
  <meta name="geo.region" content="IN" />
  <meta name="geo.placename" content="India" />
  <meta name="language" content="English,Hindi" />

</Helmet>

    <ThemeProvider>
      <SmoothScroll />
      <AnimatedText />
      <Navbar />
      <NavbarDropdown />

      <Chat />
      <Toaster position="top-right" reverseOrder={false} />
      <Ads />
      <ScrollToTop />

      <Routes>
        {/* Homepage */}
        <Route
          path="/"
          element={
            <div className="flex flex-col gap-10">
              <AcharBanner />
              <Category />
              <AllProduct />
              <div className="">
                <AcharProductList />
              </div>
              <AcharBannerTwo />
              <GanpatiProductList />
              {/* <CupProductList /> */}
              <AgarbattiProductList />
              <GheeProductList />
              <ServicesNav />
              {/* <MasalaProductList /> */}
              {/* <OilProductList /> */}
              <HomeCertificates />
              <BeyondProducts />
              <VideoAdvertiseList />
            </div>
          }
        />

        {/* Auth */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/login" element={<LoginFlow />} />
        <Route path="/about" element={<AboutUS />} />

        {/* Profile & Admin */}
        <Route path="/profile" element={<ProfileDashboard />} />
        <Route path="/admin" element={<AdminProtected />} />
        <Route path="/adminworker" element={<AdminProtectWorker />} />

        {/* Cart & Checkout */}
        <Route path="/cart" element={<AddToCart />} />
        <Route path="/checkout" element={<ProceedToCheckout />} />

        {/* Category Products */}
        <Route path="/achar-category/:slug" element={<CategoryProducts />} />
        <Route path="/products/:slug/:id" element={<AcharProductDetail />} />

        <Route path="/ghee/:slug" element={<GheeCategoryProduct />} />
        <Route path="/ghee-product/:slug/:id" element={<GheeProductDetail />} />

        <Route
          path="/masala-category/:slug"
          element={<MasalaCategoryProduct />}
        />
        <Route
          path="/masala-product/:slug/:id"
          element={<MasalaProductDetail />}
        />

        <Route path="/oil/category/:slug" element={<OilCategoryProduct />} />
        <Route path="/oil-product/:slug/:id" element={<OilProductDetail />} />
        {/* <Route path="/cup-category/:slug" element={<CupCategoryProduct />} /> */}
        {/* <Route path="/cup-product/:slug/:id" element={<CupDetail />} /> */}
        <Route
          path="/agarbatti-category/:slug"
          element={<AgarbattiCategoryProduct />}
        />
        <Route
          path="/agarbatti-product/:slug/:id"
          element={<AgarbattiDetail />}
        />
        <Route
          path="/ganpati-category/:slug"
          element={<GanpatiCategoryProduct />}
        />
        <Route path="/ganpati-product/:slug/:id" element={<GanpatiDetail />} />
        <Route path="/products" element={<Products />} />

        {/* Orders & Invoices */}
        <Route path="/order/:id" element={<OrderTracking />} />
        <Route path="/invoice/:id" element={<Invoice />} />

        {/* Support & Policies */}
        <Route path="/faq" element={<FAQs />} />
        <Route path="/shipping-returns" element={<ShippingReturns />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/contact" element={<ContactUs />} />

        <Route path="/developer" element={<Developer />} />
        <Route path="/GausamvardhanOrganicHandcrafted" element={<GausamvardhanOrganicHandcrafted />} />
        <Route path="/JoinCollective" element={<JoinCollective />} />

      </Routes>

      <Footer />
    </ThemeProvider>
   </>
  );
}

export default App;
