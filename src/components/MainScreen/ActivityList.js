import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./ActivityList.css";
import Spinner from "react-bootstrap/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ActivityList = () => {
    const location = useLocation();
    const { maQuyTrinh, tenQuyTrinh } = location.state || {};

    const [activities, setActivities] = useState([]);
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [editingActivity, setEditingActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [activitiesRes, processesRes] = await Promise.all([
                    axios.get("https://localhost:7135/api/ChiTietHoatDongSanXuats"),
                    axios.get("https://localhost:7135/api/QuyTrinhSanXuatx")
                ]);

                if (!Array.isArray(activitiesRes?.data) || !Array.isArray(processesRes?.data)) {
                    throw new Error("Dữ liệu API không hợp lệ");
                }

                const processMap = new Map(
                    processesRes.data.map(p => [p.maQuyTrinh, p.tenQuyTrinh])
                );

                const processedActivities = activitiesRes.data.map(activity => ({
                    ...activity,
                    id: activity.id || activity.maHoatDong,
                    tenQuyTrinh: processMap.get(activity.maQuyTrinh) || "Không xác định"
                })).sort((a, b) => a.tenQuyTrinh.localeCompare(b.tenQuyTrinh));

                setActivities(processedActivities);
                filterActivities(processedActivities, tenQuyTrinh);

            } catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err);
                setError(err.message);
                toast.error("Lỗi khi tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [tenQuyTrinh]);
    const filterActivities = (activitiesList, processName) => {
        const filtered = processName
            ? activitiesList.filter(a => a.tenQuyTrinh === processName)
            : activitiesList;
        setFilteredActivities(filtered);
    };
    const handleDelete = async (activity) => {
        const activityId = activity.id;

        if (!activityId) {
            toast.error("Không tìm thấy ID hoạt động");
            console.error("Activity object:", activity);
            return;
        }

        if (!window.confirm(`Bạn có chắc muốn xóa hoạt động "${activity.tenHoatDong}"?`)) return;

        try {
            await axios.delete(`https://localhost:7135/api/ChiTietHoatDongSanXuats/${activityId}`);

            const updatedActivities = activities.filter(a => a.id !== activityId);
            setActivities(updatedActivities);
            filterActivities(updatedActivities, tenQuyTrinh);

            toast.success("Xóa hoạt động thành công!");
        } catch (err) {
            console.error("Lỗi khi xóa:", err);
            toast.error(`Xóa thất bại: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleEdit = (activity) => {
        setEditingActivity({ ...activity });
    };

    const handleSaveEdit = async () => {
        try {
            await axios.put(
                `https://localhost:7135/api/ChiTietHoatDongSanXuats/${editingActivity.id}`,
                editingActivity
            );

            toast.success("Cập nhật thành công!");

            // Cập nhật local state thay vì gọi lại API
            const updatedActivities = activities.map(a =>
                a.id === editingActivity.id ? editingActivity : a
            );

            setActivities(updatedActivities);
            filterActivities(updatedActivities, tenQuyTrinh);
            setEditingActivity(null);

        } catch (err) {
            console.error("Lỗi khi cập nhật:", err);
            toast.error("Cập nhật thất bại!");
        }
    };



    const handleDownload = async (activity) => {
        const activityId = activity.id;
        const token = localStorage.getItem("token");

        if (!activityId) {
            toast.error("Không tìm thấy ID hoạt động");
            return;
        }

        try {
            const response = await axios.get(`https://localhost:7135/api/ChiTietHoatDongSanXuats/download/${activityId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob', // Quan trọng: nhận file dưới dạng blob
            });

            // Tạo link tạm thời để tải file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', activity.tenHoatDong + '.pdf'); // Bạn có thể thay đổi đuôi file nếu cần
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success("Tải file thành công!");
        } catch (err) {
            console.error("Lỗi khi tải file:", err);
            toast.error("Tải file thất bại!");
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditingActivity(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return (
            <div className="loading-overlay">
                <Spinner animation="border" variant="primary" />
                <p>Đang tải danh sách hoạt động...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h3>Đã xảy ra lỗi</h3>
                <p>{error}</p>
                <button
                    className="retry-btn"
                    onClick={() => window.location.reload()}
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="activity-list-container">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="header-section">
                <h2>
                    {tenQuyTrinh
                        ? `Hoạt động: ${tenQuyTrinh}`
                        : "Tất cả hoạt động sản xuất"}
                </h2>
            </div>

            <div className="table-responsive">
                <table className="activity-table">
                    <thead>
                        <tr>
                            <th>Tên Quy Trình</th>
                            <th>Hoạt Động</th>
                            <th>Công Đoạn</th>
                            <th>Thứ Tự</th>
                            <th>Số Lượng Chờ</th>
                            <th>Thời Gian (phút)</th>
                            <th>Mô Tả</th>
                            <th>Bản vẽ/Hướng dẫn</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredActivities.length > 0 ? (
                            filteredActivities.map(activity => (
                                <tr key={activity.id}>
                                    <td>{activity.tenQuyTrinh}</td>
                                    <td>{activity.tenHoatDong}</td>
                                    <td>{activity.giaiDoanSanXuat}</td>
                                    <td>{activity.thuTu}</td>
                                    <td>{activity.soLuongChoXuLy || 0}</td>
                                    <td>{activity.thoiGianMacDinh}</td>
                                    <td className="description-cell">
                                        {activity.moTa || "Không có mô tả"}
                                    </td>
                                    <td>
                                        {activity.fileData ? (
                                            <button
                                                onClick={() => handleDownload(activity)}
                                                className="btn btn-primary"
                                            >
                                                Tải xuống
                                            </button>
                                        ) : "Không có file"}
                                    </td>
                                    <td className="action-buttons">
                                        <button
                                            className="edit-btn"
                                            onClick={() => handleEdit(activity)}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(activity)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="no-data">
                                    {tenQuyTrinh
                                        ? `Không có hoạt động nào cho quy trình ${tenQuyTrinh}`
                                        : "Không có hoạt động nào"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {editingActivity && (
                <div className="edit-modal">
                    <div className="modal-content">
                        <h3>Chỉnh sửa hoạt động</h3>

                        <div className="form-group">
                            <label>Tên hoạt động:</label>
                            <input
                                type="text"
                                name="tenHoatDong"
                                value={editingActivity.tenHoatDong}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Công đoạn:</label>
                            <input
                                type="text"
                                name="giaiDoanSanXuat"
                                value={editingActivity.giaiDoanSanXuat}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Thứ tự:</label>
                            <input
                                type="number"
                                name="thuTu"
                                value={editingActivity.thuTu}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Số lượng chờ:</label>
                            <input
                                type="number"
                                name="soLuongChoXuLy"
                                value={editingActivity.soLuongChoXuLy}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Thời gian (phút):</label>
                            <input
                                type="number"
                                name="thoiGianMacDinh"
                                value={editingActivity.thoiGianMacDinh}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Mô tả:</label>
                            <textarea
                                name="moTa"
                                value={editingActivity.moTa}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="modal-actions">
                            <button
                                className="save-btn"
                                onClick={handleSaveEdit}
                            >
                                Lưu
                            </button>
                            <button
                                className="cancel-btn"
                                onClick={() => setEditingActivity(null)}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivityList;
