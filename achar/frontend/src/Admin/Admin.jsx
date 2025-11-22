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

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("adminTheme") || "diwali";
  });

  useEffect(() => {
    localStorage.setItem("adminTheme", theme);
  }, [theme]);

  const renderComponent = () => {
    switch (activeComponent) {
      case "stockquantity":
        return <AdminStockAlert />;
      case "workercreate":
        return <WorkerAdminCreateUser />;
      case "workertracking":
        return <AdminWorkerTracking />;
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
        return (
          <div className="p-6">
            <ProAdminDashboard />
          </div>
        );
      case "users":
        return <AdminUserAllData />;
      default:
        return (
          <div className="p-6">
            <div className="bg-gradient-to-br from-purple-800 to-purple-600 text-yellow-100 p-8 rounded-2xl shadow-xl text-center text-2xl font-bold">
              Welcome
            </div>
          </div>
        );
    }
  };

  const themeGradients = {
    diwali: "from-[#2E0057] via-[#4B0082] to-[#5E17EB]",
    newyear: "from-[#000428] via-[#004e92] to-[#000428]",
    christmas: "from-[#145A32] via-[#0B5345] to-[#145A32]",
    pongal: "from-[#ffb347] via-[#ffcc33] to-[#ffb347]",
    rakhi: "from-[#8E2DE2] via-[#C779D0] to-[#8E2DE2]",
  };

  return (
    <div
      className={`flex min-h-screen bg-gradient-to-br ${
        themeGradients[theme] || themeGradients["diwali"]
      } transition-all duration-700`}
    >
      <Sidebar setActive={setActiveComponent} setTheme={setTheme} />
      <div className="flex-1 p-6 overflow-y-auto">{renderComponent()}</div>
    </div>
  );
};

export default Admin;
