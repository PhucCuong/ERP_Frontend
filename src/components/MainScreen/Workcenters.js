import React, { useState, useEffect } from "react";
import { Search, Plus, Trash, Edit, X } from "lucide-react";
import axios from "axios";
import "./Workcenters.css";

const WorkCenter = () => {
    const [workCenters, setWorkCenters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingWorkCenter, setEditingWorkCenter] = useState(null);
    const [newWorkCenter, setNewWorkCenter] = useState({
        tenNhaMay: "",
        phanLoai: "",
        diaChi: "",
        soDienThoai: "",
        nguoiQuanLy: "",
        chiPhi: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://localhost:7135/api/NhaMayx");
                setWorkCenters(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAddOrUpdateWorkCenter = async (e) => {
        e.preventDefault();
        try {
            if (editingWorkCenter) {
                await axios.put(`https://localhost:7135/api/NhaMayx/${editingWorkCenter.maNhaMay}`, newWorkCenter);
                setWorkCenters(workCenters.map(wc => wc.maNhaMay === editingWorkCenter.maNhaMay ? { ...wc, ...newWorkCenter } : wc));
            } else {
                const response = await axios.post("https://localhost:7135/api/NhaMayx", newWorkCenter);
                setWorkCenters([...workCenters, response.data]);
            }
            setNewWorkCenter({ tenNhaMay: "", phanLoai: "", diaChi: "", soDienThoai: "", nguoiQuanLy: "", chiPhi: "" });
            setEditingWorkCenter(null);
            setShowForm(false);
        } catch (err) {
            console.error("Error adding/updating work center:", err);
        }
    };

    const handleEdit = (workCenter) => {
        setNewWorkCenter(workCenter);
        setEditingWorkCenter(workCenter);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://localhost:7135/api/NhaMayx/${id}`);
            setWorkCenters(workCenters.filter(wc => wc.maNhaMay !== id));
        } catch (err) {
            console.error("Error deleting work center:", err);
        }
    };

    return (
        <div className="work-center-container">
            <div className="work-center-header">Work Centers</div>

            <div className="work-center-content">
                <div className="work-center-controls">
                    <button
                        className="work-center-button"
                        onClick={() => {
                            setShowForm(true); // Hiển thị form
                            setEditingWorkCenter(null); // Đảm bảo không ở chế độ chỉnh sửa
                            setNewWorkCenter({ // Đặt lại giá trị rỗng cho input
                                tenNhaMay: "",
                                phanLoai: "",
                                diaChi: "",
                                soDienThoai: "",
                                nguoiQuanLy: "",
                                chiPhi: ""
                            });
                        }}>
                        <Plus size={16} /> Add Work Center
                    </button>

                    <div className="work-center-search">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="work-center-search-input"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Search className="work-center-search-icon" size={16} />
                    </div>
                </div>

                {showForm && (
                    <form className="work-center-form" onSubmit={handleAddOrUpdateWorkCenter}>
                        <h3 className="work-center-form-title">{editingWorkCenter ? "Edit Work Center" : "Add New Work Center"}</h3>

                        <input type="text" placeholder="Work Center Name" required className="work-center-input"
                            value={newWorkCenter.tenNhaMay} onChange={(e) => setNewWorkCenter({ ...newWorkCenter, tenNhaMay: e.target.value })} />
                        <input type="text" placeholder="Categorization" required className="work-center-input"
                            value={newWorkCenter.phanLoai} onChange={(e) => setNewWorkCenter({ ...newWorkCenter, phanLoai: e.target.value })} />
                        <input type="text" placeholder="Address" required className="work-center-input"
                            value={newWorkCenter.diaChi} onChange={(e) => setNewWorkCenter({ ...newWorkCenter, diaChi: e.target.value })} />
                        <input type="text" placeholder="Phone Number" required className="work-center-input"
                            value={newWorkCenter.soDienThoai} onChange={(e) => setNewWorkCenter({ ...newWorkCenter, soDienThoai: e.target.value })} />
                        <input type="text" placeholder="Manager" required className="work-center-input"
                            value={newWorkCenter.nguoiQuanLy} onChange={(e) => setNewWorkCenter({ ...newWorkCenter, nguoiQuanLy: e.target.value })} />
                        <input type="number" placeholder="Cost" required className="work-center-input"
                            value={newWorkCenter.chiPhi} onChange={(e) => setNewWorkCenter({ ...newWorkCenter, chiPhi: e.target.value })} />
                        <div className="work-center-form-actions">
                            <button type="submit" className="work-center-button">{editingWorkCenter ? "Update" : "Submit"}</button>
                            <button
                                type="button"
                                className="work-center-button exit-button"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingWorkCenter(null); // Đặt lại trạng thái về null
                                }}>
                                <X size={16} /> Thoát
                            </button>
                        </div>
                    </form>
                )}

                <div className="work-center-table-container">
                    <table className="work-center-table">
                        <thead>
                            <tr className="work-center-table-header">
                                <th>Name</th>
                                <th>Categorization</th>
                                <th>Address</th>
                                <th>Phone</th>
                                <th>Manager</th>
                                <th>Cost</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="8">Loading...</td></tr>
                            ) : error ? (
                                <tr><td colSpan="8" className="work-center-error">{error}</td></tr>
                            ) : (
                                workCenters.map((workCenter) => (
                                    <tr key={workCenter.maNhaMay}>
                                        <td>{workCenter.tenNhaMay}</td>
                                        <td>{workCenter.phanLoai}</td>
                                        <td>{workCenter.diaChi}</td>
                                        <td>{workCenter.soDienThoai}</td>
                                        <td>{workCenter.nguoiQuanLy}</td>
                                        <td>{workCenter.chiPhi?.toLocaleString()} VND</td>
                                        <td>
                                            <button className="edit-button" onClick={() => handleEdit(workCenter)}><Edit size={16} /></button>
                                            <button className="delete-button" onClick={() => handleDelete(workCenter.maNhaMay)}><Trash size={16} /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default WorkCenter;
