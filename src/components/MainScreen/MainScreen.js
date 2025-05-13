import { Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";
import "./MainScreen.css";
import Bom from "./Bom";
import Products from "./Products";
import Manfacturingorders from "./Manfacturingorders";
import Workorders from "./Workorders";
import Unbuildorders from "./Unbuildorders";
import Quality from "./Quality";
import Productionprocess from "./Productionprocess";
import Workcenters from "./Workcenters";
import Reportings from "./Reportings";
import CreateProduct from "./CreateProduct";
import ManfacturingDetail from "./ManfacturingDetail";
import RawMaterials from "./RawMaterials";
import AddProcessForm from "./AddProcessForm";
import ActivityList from "./ActivityList";
import AddPlant from "./AddPlant"
import TonKho from "./tonkho";
import AddNhaCungCap from "./NhaCungCap";
import ActivityDetails from "./ActivityDetails";
import DashBoard from "./DashBoard"
import GiaoHang from "./GiaoHang";
const MainScreen = ({userName}) => {
    return (
        <div className="mainscreen_container">
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />

                <Route path="/dashboard" element={<DashBoard />} />
                <Route path="/bom" element={<Bom />} />
                <Route path="/raw-materials" element={<RawMaterials />} />
                <Route path="/products" element={<Products />} />
                <Route path="/manfacturingorders" element={<Manfacturingorders/>} />
                <Route path="/workorders" element={<Workorders />} />
                <Route path="/unbuildorders" element={<Unbuildorders />} />
                <Route path="/quality" element={<Quality userName={userName}/>} />
                <Route path="/productionprocess" element={<Productionprocess />} />
                <Route path="/workcenters" element={<Workcenters />} />
                <Route path="/reportings" element={<Reportings />} />
                <Route path="/products/create" element={<CreateProduct />} />
                <Route path="/manfacturing/detail" element={<ManfacturingDetail userName={userName}/>} />
                <Route path="/tonkho" element={<TonKho />} />
                <Route path="/activities/:processId" element={<ActivityList />} />
                <Route path="/add-process" element={<AddProcessForm />} />
                <Route path="/manfacturingorders/create" element={<AddPlant userName={userName}/>} />
                <Route path="/NhaCungCap" element={<AddNhaCungCap />} />
                <Route path="/add-activity" element={<ActivityDetails />} />
                
                <Route path="/GiaoHang" element={<GiaoHang />} />

            </Routes>
        </div>
    );
};

export default MainScreen;
