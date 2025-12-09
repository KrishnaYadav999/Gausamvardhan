import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
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
import AdminWorkerTracking from "./AdminWorkerTracking";
import WorkerAdminCreateUser from "./WorkerAdminCreateUser";
import AdminStockAlert from "./AdminStockAlert";
import ProAdminDashboard from "./ProAdminDashboard";
import AdminVideoAdvertiseCreate from "./AdminVideoAdvertiseCreate";
import AdminAdvertiseDeleteUpdate from "./AdminAdvertiseDeleteUpdate";
import AdminAgarbatiCreate from "./AdminAgarbatiCreate";
import AdminAgarbattiUpdateDelete from "./AdminAgarbattiUpdateDelete";
import AdminGanpatiCreate from "./AdminGanpatiCreate";
import AdminCupCreate from "./AdminCupCreate";
import AdminGanpatiManage from "./AdminGanpatiManage";

const Admin = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");

  useEffect(() => {
    document.body.classList.add("no-navbar-footer");

    return () => {
      document.body.classList.remove("no-navbar-footer");
    };
  }, []);

  const renderComponent = () => {
    switch (activeComponent) {
      case "workercreate":
        return <WorkerAdminCreateUser />;
      case "workertracking":
        return <AdminWorkerTracking />;
      case "stockquantity":
        return <AdminStockAlert />;
      case "alluser":
        return <AdminUserAllData />;
      case "userorders":
        return <AdminUserOrders />;
      case "banner":
        return <AdminCreateBanner />;
      case "smallbanner":
        return <AdminSmallBanner />;
      case "acharcategory":
        return <AdminCategoryCreate />;
      case "acharproduct":
        return <AdminProductCreate />;
      case "acharproductdeleteupdate":
        return <AdminGetDeleteProduct />;
      case "gheeproductcreate":
        return <AdminGheeProductCreate />;
      case "gheeproductupdatedelete":
        return <GheeProductUpdateDelete />;
      case "masalaproductcreate":
        return <AdminMasalaProduct />;
      case "masalaproductupdatedelete":
        return <AdminMasalaUpdateDelete />;
      case "oilproductcreate":
        return <AdminOilProductCreate />;
      case "oilproductupdatedelete":
        return <AdminOilUpdateDelete />;
      case "adminagarbaticreate":
        return <AdminAgarbatiCreate />;
      case "adminagarbattiupdatedelete":
        return <AdminAgarbattiUpdateDelete />;
      case "admincreateadvertize":
        return <AdminVideoAdvertiseCreate />;
      case "videoadvertizeupdatedelete":
        return <AdminAdvertiseDeleteUpdate />;
      case "adminganpaticreate":
        return <AdminGanpatiCreate />;
      case "adminganpatimanage":
        return <AdminGanpatiManage />;
      case "cupcreate":
        return <AdminCupCreate />;
      case "dashboard":
        return <ProAdminDashboard />;
      default:
        return <div className="text-center text-xl p-6">Welcome</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Sidebar */}
      <Sidebar setActive={setActiveComponent} />

      {/* Main Content */}
      <div className="flex-1 min-h-screen overflow-y-auto backdrop-blur-xl">
        {/* Header */}
        <header
          className="
          h-16 bg-white/70 backdrop-blur-md 
          shadow-md flex items-center px-6 sticky top-0 z-50 
          border-b border-gray-200/70
        "
        >
          <h1 className="font-semibold tracking-wide text-gray-800 text-lg">
            {activeComponent.toUpperCase()}
          </h1>
        </header>

        {/* Page Body */}
        <div className="p-6">
          <div
            className="
              bg-white/80 backdrop-blur-md 
              rounded-2xl shadow-xl p-6 min-h-[80vh]
              border border-gray-200/60
              transition-all duration-300 hover:shadow-2xl
            "
          >
            {renderComponent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
