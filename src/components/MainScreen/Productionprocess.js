import "./Productionprocess.css";
import Spinner from "react-bootstrap/Spinner";
import { FaSearch, FaTrash, FaEdit } from "react-icons/fa";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Productionprocess = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [processes, setProcesses] = useState([]); 
    const [hoveredRowIndex, setHoveredRowIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get("https://localhost:7135/api/QuyTrinhSanXuatx");
            setProcesses(response.data);
        } catch (error) {
            console.error("Lỗi kết nối đến server:", error.message);
            toast.error("Lỗi kết nối đến server!");
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (maQuyTrinh, tenQuyTrinh) => {
        navigate(`/activities/${maQuyTrinh}`, {
            state: {
                maQuyTrinh: maQuyTrinh,
                tenQuyTrinh: tenQuyTrinh  // Thêm tenQuyTrinh vào state
            }
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://localhost:7135/api/QuyTrinhSanXuatx/${id}`);
            setProcesses(processes.filter(item => item.maQuyTrinh !== id));
            toast.success("Đã xóa quy trình sản xuất!");
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            toast.error("Lỗi khi xóa quy trình!");
        }
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };  
    const filteredProcesses = processes.filter(process =>
        process.tenQuyTrinh.toLowerCase().includes(searchQuery.toLowerCase()) ||
        process.maQuyTrinh.toLowerCase().includes(searchQuery.toLowerCase())  // Thêm điều kiện lọc cho mã quy trình
    );

    return (
        <div>
            <div className="product-header">QUY TRÌNH SẢN XUẤT</div>
            <div className="manfactring-button-row">
                <button
                    className='production-process-new-button'
                    onClick={() => navigate("/add-process")}
                >
                    + Thêm quy trình
                </button>
                <input
                    className="manfacturing-filter-input"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
                <button className="manfacturing-search-button">
                    <FaSearch />
                </button>
            </div>
            <table className="manfacturing-table">
                <thead>
                    <tr className="manfacturing-table-title">
                        <th>Mã Quy Trình</th>
                        <th>Tên Quy Trình</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProcesses.length === 0 ? (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center' }}>Không có quy trình nào</td>
                        </tr>
                    ) : (
                        filteredProcesses.map((item, index) => (
                            <tr
                                key={item.maQuyTrinh}
                                style={{
                                    backgroundColor: hoveredRowIndex === index ? "#C0C0C0" : index % 2 !== 0 ? "#D1E8FE" : "#ffffff",
                                    transition: "background-color 0.3s",
                                }}
                                onMouseEnter={() => setHoveredRowIndex(index)}
                                onMouseLeave={() => setHoveredRowIndex(null)}
                            >
                                <td>{item.maQuyTrinh}</td>
                                <td>{item.tenQuyTrinh}</td>
                                <td>
                                    <button
                                        className="edit-button"
                                        onClick={() => handleEditClick(item.maQuyTrinh, item.tenQuyTrinh)}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDelete(item.maQuyTrinh)}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            {loading && <Loading />}
            <ToastContainer theme="colored" />
        </div>
    );
};

function Loading() {
    return (
        <div className="loading-overlay">
            <Spinner animation="grow" variant="primary" />
        </div>
    );
}

export default Productionprocess;
