import './Productionprocess.css'
import Spinner from 'react-bootstrap/Spinner';
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
const Productionprocess = () => {
    // chức năng loading spinner
    const [loading, setLoading] = useState(false);

    // nhận giá trị api trả về
    const [processes, setProcesses] = useState([])

    // hover từng dòng
    const [hoveredRowIndex, setHoveredRowIndex] = useState(null)

    useEffect(() => {
        let interval
        const fetchData = async () => {
            setLoading(true);
            interval = setTimeout(() => {
                setLoading(false);
            }, 300);

            try {
                const response = await axios.get("https://localhost:7135/api/QuyTrinhSanXuatx");
                setProcesses(response.data);
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log("Request canceled", error.message);
                } else if (error.response && error.response.status === 401) {
                    notify(error.message);
                } else {
                    console.log("Lỗi kết nối đến server:", error.message);
                    notify("Lỗi kết nối đến server:", error.message);
                }
            }
        };

        fetchData();
        return () => {
            clearTimeout(interval); // Dọn dẹp interval
        };
    }, [])

    const notify = (message) => toast.info(message, {
        type: "error"
    });
    return (
        <div>
            <div className="product-header">Production process</div>
            <div className="manfactring-button-row">
                            <button className='production-process-new-button'>New</button>
                            <input className='manfacturing-filter-input' />
                            <button className='manfacturing-search-button'><FaSearch /></button>
                            <select className='manfacturing-select'>
                                <option value=""> Select </option>
                                <option value="apple">Táo</option>
                                <option value="banana">Chuối</option>
                                <option value="orange">Cam</option>
                            </select>
                            <select className='manfacturing-select'>
                                <option value=""> Human </option>
                                <option value="apple">Táo</option>
                                <option value="banana">Chuối</option>
                                <option value="orange">Cam</option>
                            </select>
                        </div>
            <table className='manfacturing-table'>
                <thead>
                    <tr className='manfacturing-table-title'>
                        <th>Process ID</th>
                        <th>Process Name</th>
                        <th>Description</th>
                    </tr>
                </thead>

                <tbody style={{overflow: 'auto'}}>
                    {
                        processes.map((item, index) => (
                            <tr
                                key={index}
                                style={{
                                    backgroundColor:
                                        hoveredRowIndex === index
                                            ? "#C0C0C0" // Màu khi hover
                                            : index % 2 !== 0
                                                ? "#D1E8FE" // Màu nền xen kẽ
                                                : "#ffffff",
                                    transition: "background-color 0.3s", // Hiệu ứng mượt mà
                                }}
                                className="manfacturing-row"
                                onMouseEnter={() => setHoveredRowIndex(index)}
                                onMouseLeave={() => setHoveredRowIndex(null)}
                            >
                                <td>{item.maQuyTrinh}</td>
                                <td>{item.tenQuyTrinh}</td>
                                <td>{item.moTa}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            {loading && <Loading />} {/* Hiển thị Loading khi đang xử lý */}
            <ToastContainer theme="colored" />
        </div>
    )
}

function Loading() {
    return (
        <div
            style={{
                width: '100%',
                height: '100vh',
                backgroundColor: "rgba(0, 0, 0, 0.2)", // Màu nền mờ
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999, // Đảm bảo hiển thị trên tất cả
                position: 'fixed',
                top: 0,
                right: 0,
            }}
        >
            <Spinner animation="grow" variant="primary" />
        </div>
    );
}

export default Productionprocess