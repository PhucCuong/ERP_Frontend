import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './GiaoHang.css';

const GiaoHang = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, materialsRes, suppliersRes] = await Promise.all([
                    axios.get("https://localhost:7135/api/YeuCauNguyenVatLieux"),
                    axios.get("https://localhost:7135/api/NguyenVatLieux"),
                    axios.get("https://localhost:7135/api/NhaCungCap"),
                ]);

                setOrders(ordersRes.data);
                setMaterials(materialsRes.data);
                setSuppliers(suppliersRes.data);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            }
        };

        fetchData();
    }, []);

    const getMaterialName = (maNguyenVatLieu) => {
        const material = materials.find(m => m.maNguyenVatLieu === maNguyenVatLieu);
        return material ? material.tenNguyenVatLieu : "Không xác định";
    };

    const getSupplierName = (maNhaCungCap) => {
        const supplier = suppliers.find(s => s.maNhaCungCap === maNhaCungCap);
        return supplier ? supplier.tenNhaCungCap : "Không xác định";
    };

    const getSupplierEmail = (maNhaCungCap) => {
        const supplier = suppliers.find(s => s.maNhaCungCap === maNhaCungCap);
        return supplier ? supplier.email : "Không xác định";
    };

    const getMaterialUnit = (maNguyenVatLieu) => {
        const material = materials.find(m => m.maNguyenVatLieu === maNguyenVatLieu);
        return material ? material.donViTinh : "Không xác định";
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN");
    };

    const formatCurrency = (value) => {
        if (!value) return "0 VNĐ";
        return Number(value).toLocaleString("vi-VN") + " VNĐ";
    };

    return (
        <div className="giao-hang-container">
            <h2>Danh sách đơn hàng</h2>

            <table className="giao-hang-table">
                <thead>
                    <tr>
                        <th>Tên nguyên vật liệu</th>
                        <th>Nhà cung cấp</th>
                        <th>Mail</th> 
                        <th>Số lượng</th>
                        <th>Đơn vị tính</th>
                        <th>Ngày giao hàng dự kiến</th>
                        <th>Ngày tạo</th>
                        <th>Tổng tiền</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id || `${order.maNguyenVatLieu}-${order.ngayTao}`}>
                            <td>{getMaterialName(order.maNguyenVatLieu)}</td>
                            <td>{getSupplierName(order.maNhaCungCap)}</td>
                            <td>{getSupplierEmail(order.maNhaCungCap)}</td> {/* Mail */}
                            <td>{order.soLuongCanThiet}</td>
                            <td>{getMaterialUnit(order.maNguyenVatLieu)}</td> {/* Đơn vị tính */}
                            <td>{formatDate(order.ngayGiaoHangDuKien)}</td>
                            <td>{formatDate(order.ngayTao)}</td>
                            <td>{formatCurrency(order.tongTien)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ToastContainer />
        </div>
    );
};

export default GiaoHang;
