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
import MasalaProductList from "./components/MasalaProductList";
import Ads from "./components/Ads";
import NavbarDropdown from "./components/NavbarDropdown";
import Chat from "./components/Chat";
import OilCategoryProduct from "./components/OilCategoryProduct";
import OilProductDetail from "./components/OilProductDetail";
import ServicesNav from "./components/ServicesNav";
import ScrollToTop from "./components/ScrollToTop";
import SmoothScroll from "./components/SmoothScroll";
import OilProductList from "./components/OilProductList";
import ProceedToCheckout from "./components/ProceedToCheckout";
import Invoice from "./components/Invoice";
import OrderTracking from "./components/OrderTracking";

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
import CupCategoryProduct from "./components/CupCategoryProduct";
import CupDetail from "./components/CupDetail";
import CupProductList from "./components/CupProductList";

function App() {
  return (
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
              <CupProductList />
              <AgarbattiProductList />
              <GheeProductList />
              <ServicesNav />
              <MasalaProductList />
              <OilProductList />
              <VideoAdvertiseList />
            </div>
          }
        />

        {/* Auth */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/login" element={<LoginFlow />} />

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
        <Route path="/cup-category/:slug" element={<CupCategoryProduct />} />
        <Route path="/cup-product/:slug/:id" element={<CupDetail />} />
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

        {/* Orders & Invoices */}
        <Route path="/order/:id" element={<OrderTracking />} />
        <Route path="/invoice/:id" element={<Invoice />} />

        {/* Support & Policies */}
        <Route path="/faq" element={<FAQs />} />
        <Route path="/shipping-returns" element={<ShippingReturns />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/contact-us" element={<ContactUs />} />
      </Routes>

      <Footer />
    </ThemeProvider>
  );
}

export default App;
