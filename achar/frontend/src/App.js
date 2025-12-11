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
// import CupCategoryProduct from "./components/CupCategoryProduct";
// import CupDetail from "./components/CupDetail";
// import CupProductList from "./components/CupProductList";

function App() {
  return (
   <>
    <Helmet>
  {/* ===== PAGE TITLE ===== */}
  <title>
    gausamvardhan – pure desi ghee, achar, agarbatti, masala, oils & pooja essentials online
  </title>

  {/* ===== META DESCRIPTION ===== */}
  <meta
    name="description"
    content="Buy premium desi ghee, achar (pickles), oils, masala, agarbatti, dhoop cups, ganpati murti & pooja essentials at gausamvardhan. Shop garlic ginger chili pickle, bharwa lal mirch achar, mango achar, amla pickle, haldi mirchi achar & more. 100% authentic, chemical-free products."
  />

  {/* ===== CANONICAL ===== */}
  <link rel="canonical" href="https://www.gausamvardhan.com/" />

  {/* ===== OPEN GRAPH ===== */}
  <meta property="og:title"
    content="gausamvardhan – pure ghee, pickles, masala, oils & pooja essentials" />
  <meta
    property="og:description"
    content="Shop premium desi ghee, handmade achar, pure oils, agarbatti, dhoop cups, masalas & ganpati murti from gausamvardhan. Authentic natural products for your home."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://www.gausamvardhan.com/" />
  <meta property="og:site_name" content="gausamvardhan" />
  <meta property="og:image" content="https://www.gausamvardhan.com/images/og-image.jpg" />

  {/* ===== TWITTER CARD ===== */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="gausamvardhan – organic & pooja products store" />
  <meta
    name="twitter:description"
    content="Explore premium ghee, achar, oils, masala, pooja essentials, agarbatti, dhoop & ganpati murti from gausamvardhan."
  />
  <meta name="twitter:image" content="https://www.gausamvardhan.com/images/og-image.jpg" />
  <meta name="twitter:site" content="@gausamvardhan" />

  {/* ===== ROBOTS ===== */}
  <meta name="robots" content="index, follow" />

  {/* ===== KEYWORDS (ENGLISH + HINDI) ===== */}
  <meta
    name="keywords"
    content="
    desi ghee, pure ghee, a2 ghee, cow ghee,
    organic oil, mustard oil, groundnut oil, cold pressed oil,
    masala, indian spices, haldi, mirchi, garam masala,
    achar, pickles, handmade pickles, traditional pickle,
    garlic ginger chili pickle, ginger garlic pickle,
    lal mirchi bharwa achar, stuffed red chili pickle,
    jackfruit pickle, kathal ka achar,
    lemon chili pickle, nimbu mirchi achar,
    nimbu achar, lemon pickle,
    amla pickle, amla achar,
    haldi mirchi amla adrak pickle, mixed pickle,
    mango pickle, aam ka achar, mango achar,
    agarbatti, dhoop, dhoop cups, pooja essentials,
    ganpati murti, ganesh murti, pooja samagri,
    cups for dhoop, organic pooja products,
    gausamvardhan products, natural products, ayurvedic products,

    desi ghee online, pure ghee buy, organic ghee shop,
    achar online, pickles online india,
    agarbatti online, dhoop cups shop,
    pooja essentials online, ganpati murti online,

    देसी घी, ए2 घी, शुद्ध घी,
    अचार, मिक्स अचार, आम का अचार,
    नींबू का अचार, नींबू मिर्च का अचार,
    लहसुन अदरक मिर्च अचार,
    लाल मिर्च भरवा अचार,
    कटहल का अचार, आंवला अचार,
    हल्दी मिर्च आंवला अदरक अचार,
    मसाला, तेल, पूजा सामग्री,
    अगरबत्ती, धूप, धूप कप,
    गणपति मूर्ति, पूजा का सामान,
    gausamvardhan उत्पाद
    "
  />
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
