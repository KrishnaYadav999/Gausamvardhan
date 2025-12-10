import React, { useState } from "react";
import SidebarWorker from "./SidebarWorker";

// Banner
import AdminCreateBanner from "./AdminCreateBanner";
import AdminSmallBanner from "./AdminSmallBanner";

// Achar
import AdminCategoryCreate from "./AdminCategoryCreate";
import AdminProductCreate from "./AdminProductCreate";
import AdminGetDeleteProduct from "./AdminGetDeleteProduct";

// Ghee
import AdminGheeProductCreate from "./AdminGheeProductCreate";
import GheeProductUpdateDelete from "./GheeProductUpdateDelete";

// Masala
import AdminMasalaProduct from "./AdminMasalaProduct";
import AdminMasalaUpdateDelete from "./AdminMasalaUpdateDelete";

// Oil
import AdminOilProductCreate from "./AdminOilProductCreate";
import AdminOilUpdateDelete from "./AdminOilUpdateDelete";

// Users
import AdminUserOrders from "./AdminUserOrders";
import AdminUserAllData from "./AdminUserAllData";

// Stock
import AdminStockAlert from "./AdminStockAlert";

// Agarbatti
import AdminAgarbatiCreate from "./AdminAgarbatiCreate";
import AdminAgarbattiUpdateDelete from "./AdminAgarbattiUpdateDelete";

// Ganpati
import AdminGanpatiCreate from "./AdminGanpatiCreate";
import AdminGanpatiManage from "./AdminGanpatiManage";

// Video Advertise
import AdminVideoAdvertiseCreate from "./AdminVideoAdvertiseCreate";
import AdminAdvertiseDeleteUpdate from "./AdminAdvertiseDeleteUpdate";

// Cup
import AdminCupCreate from "./AdminCupCreate";

const AdminWorker = ({ workerName, onLogout }) => {
  const [activeComponent, setActiveComponent] = useState("dashboard");

  const handleLogout = () => {
    localStorage.removeItem("workerToken");
    localStorage.removeItem("workerName");
    localStorage.removeItem("workerEmail");
    onLogout();
  };

  const logWorkerAction = (action) => {
    const logs = JSON.parse(localStorage.getItem("workerLogs")) || [];
    logs.push({ worker: workerName, action, time: new Date().toLocaleString() });
    localStorage.setItem("workerLogs", JSON.stringify(logs));
  };

  const renderComponent = () => {
    switch (activeComponent) {
      // ===========================
      // STOCK + USER MANAGEMENT
      // ===========================
      case "stockquantity":
        logWorkerAction("Viewed Stock Quantity");
        return <AdminStockAlert />;

      case "alluser":
        logWorkerAction("Viewed All Users");
        return <AdminUserAllData />;

      case "userorders":
        logWorkerAction("Viewed User Orders");
        return <AdminUserOrders />;

      // ===========================
      // BANNERS
      // ===========================
      case "banner":
        logWorkerAction("Banner Accessed");
        return <AdminCreateBanner />;

      case "smallbanner":
        logWorkerAction("Small Banner Accessed");
        return <AdminSmallBanner />;

      // ===========================
      // ACHAR
      // ===========================
      case "acharcategory":
        logWorkerAction("Achar Category");
        return <AdminCategoryCreate />;

      case "acharproduct":
        logWorkerAction("Achar Product Created");
        return <AdminProductCreate />;

      case "acharproductdeleteupdate":
        logWorkerAction("Achar Product Update/Delete");
        return <AdminGetDeleteProduct />;

      // ===========================
      // GHEE
      // ===========================
      case "gheeproductcreate":
        logWorkerAction("Ghee Product Created");
        return <AdminGheeProductCreate />;

      case "gheeproductupdatedelete":
        logWorkerAction("Ghee Product Update/Delete");
        return <GheeProductUpdateDelete />;

      // ===========================
      // MASALA
      // ===========================
      case "masalaproductcreate":
        logWorkerAction("Masala Product Created");
        return <AdminMasalaProduct />;

      case "masalaproductupdatedelete":
        logWorkerAction("Masala Product Update/Delete");
        return <AdminMasalaUpdateDelete />;

      // ===========================
      // OIL
      // ===========================
      case "oilproductcreate":
        logWorkerAction("Oil Product Created");
        return <AdminOilProductCreate />;

      case "oilproductupdatedelete":
        logWorkerAction("Oil Product Update/Delete");
        return <AdminOilUpdateDelete />;

      // ===========================
      // AGARBATTI (🔥 Newly Added)
      // ===========================
      case "adminagarbaticreate":
        logWorkerAction("Agarbatti Created");
        return <AdminAgarbatiCreate />;

      case "adminagarbattiupdatedelete":
        logWorkerAction("Agarbatti Updated/Deleted");
        return <AdminAgarbattiUpdateDelete />;

      // ===========================
      // GANPATI (🔥 Newly Added)
      // ===========================
      case "adminganpaticreate":
        logWorkerAction("Ganpati Product Created");
        return <AdminGanpatiCreate />;

      case "adminganpatimanage":
        logWorkerAction("Ganpati Manage Accessed");
        return <AdminGanpatiManage />;

      // ===========================
      // VIDEO ADVERTISE (🔥 Added)
      // ===========================
      case "admincreateadvertize":
        logWorkerAction("Video Advertise Created");
        return <AdminVideoAdvertiseCreate />;

      case "videoadvertizeupdatedelete":
        logWorkerAction("Video Advertise Update/Delete");
        return <AdminAdvertiseDeleteUpdate />;

      // ===========================
      // CUP (🔥 Added)
      // ===========================
      case "cupcreate":
        logWorkerAction("Cup Created");
        return <AdminCupCreate />;

      // ===========================
      // DEFAULT DASHBOARD
      // ===========================
      case "dashboard":
      default:
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold">
              Welcome {workerName}! You are logged in to Worker Dashboard.
            </h2>

            <button
              onClick={handleLogout}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex">
      <SidebarWorker setActive={setActiveComponent} />
      <div className="flex-1 bg-gray-100 min-h-screen p-4">
        {renderComponent()}
      </div>
    </div>
  );
};

export default AdminWorker;
