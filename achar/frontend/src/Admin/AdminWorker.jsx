import React, { useState } from "react";
import SidebarWorker from "./SidebarWorker";
import AdminCreateBanner from "./AdminCreateBanner";
import AdminSmallBanner from "./AdminSmallBanner";
import AdminCategoryCreate from "./AdminCategoryCreate";
import AdminProductCreate from "./AdminProductCreate";
import AdminGetDeleteProduct from "./AdminGetDeleteProduct";
import AdminGheeProductCreate from "./AdminGheeProductCreate";
import AdminMasalaProduct from "./AdminMasalaProduct";
import GheeProductUpdateDelete from "./GheeProductUpdateDelete";
import AdminOilProductCreate from "./AdminOilProductCreate";
import AdminMasalaUpdateDelete from "./AdminMasalaUpdateDelete";
import AdminOilUpdateDelete from "./AdminOilUpdateDelete";
import AdminUserOrders from "./AdminUserOrders";
import AdminUserAllData from "./AdminUserAllData";
import AdminStockAlert  from "./AdminStockAlert"

const AdminWorker = ({ workerName, onLogout }) => {
  const [activeComponent, setActiveComponent] = useState("dashboard");

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("workerToken");
    localStorage.removeItem("workerName");
    localStorage.removeItem("workerEmail");

    const logs = JSON.parse(localStorage.getItem("workerLogs")) || [];
    logs.push({
      worker: workerName,
      action: "Logged Out",
      time: new Date().toLocaleString(),
    });
    localStorage.setItem("workerLogs", JSON.stringify(logs));

    onLogout(); // redirect to login
  };

  const logWorkerAction = (action) => {
    const logs = JSON.parse(localStorage.getItem("workerLogs")) || [];
    logs.push({ worker: workerName, action, time: new Date().toLocaleString() });
    localStorage.setItem("workerLogs", JSON.stringify(logs));
  };

  const renderComponent = () => {
    switch (activeComponent) {
        case "stockquantity":
        logWorkerAction("stockquantity");
        return <AdminStockAlert />;
      case "Alluser":
        logWorkerAction("Viewed All Users");
        return <AdminUserAllData />;
      case "userOrders":
        logWorkerAction("Viewed User Orders");
        return <AdminUserOrders />;
      case "banner":
        logWorkerAction("Accessed Banner Creation");
        return <AdminCreateBanner />;
      case "smallbanner":
        logWorkerAction("Accessed Small Banner Creation");
        return <AdminSmallBanner />;
      case "acharcategory":
        logWorkerAction("Created/Updated Achar Category");
        return <AdminCategoryCreate />;
      case "acharproduct":
        logWorkerAction("Created Achar Product");
        return <AdminProductCreate />;
      case "acharproductdelete-update":
        logWorkerAction("Updated/Deleted Achar Product");
        return <AdminGetDeleteProduct />;
      case "gheeproductcreate":
        logWorkerAction("Created Ghee Product");
        return <AdminGheeProductCreate />;
      case "gheeproductupdatedelete":
        logWorkerAction("Updated/Deleted Ghee Product");
        return <GheeProductUpdateDelete />;
      case "masalaproductcreate":
        logWorkerAction("Created Masala Product");
        return <AdminMasalaProduct />;
      case "masalaproductupdateDelete":
        logWorkerAction("Updated/Deleted Masala Product");
        return <AdminMasalaUpdateDelete />;
      case "oilproductcreate":
        logWorkerAction("Created Oil Product");
        return <AdminOilProductCreate />;
      case "oilproductupdateDelete":
        logWorkerAction("Updated/Deleted Oil Product");
        return <AdminOilUpdateDelete />;
      case "dashboard":
      default:
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold">
              Welcome {workerName}! You are logged in to Team Dashboard.
            </h2>
            <button
              onClick={handleLogout}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
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
      <div className="flex-1 bg-gray-100 min-h-screen">{renderComponent()}</div>
    </div>
  );
};

export default AdminWorker;
