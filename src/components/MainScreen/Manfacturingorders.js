import './Manfacturingorders.css'
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';

const Manfacturingorders = () => {
    const navigate = useNavigate();

    const [plantList, setPlantList] = useState([]);
    const [productList, setProductList] = useState([]);
    const [facturyList, setFacturyList] = useState([]);
    const [list, setList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");

    const [loading, setLoading] = useState(false);
    const [hoveredRowIndex, setHoveredRowIndex] = useState(null);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 300);

        axios.get('https://localhost:7135/api/KeHoachSanXuatx')
            .then(response => setPlantList(response.data))
            .catch(error => console.error('Lỗi:', error));

        axios.get('https://localhost:7135/api/SanPhamx')
            .then(response => setProductList(response.data))
            .catch(error => console.error('Lỗi:', error));

        axios.get('https://localhost:7135/api/NhaMayx')
            .then(response => setFacturyList(response.data))
            .catch(error => console.error('Lỗi:', error));
    }, []);

    useEffect(() => {
        if (plantList.length && productList.length && facturyList.length) {
            const mergedData = plantList.map(plant => ({
                ...plant,
                tenSanPham: productList.find(sp => sp.maSanPham === plant.maSanPham)?.tenSanPham || null,
                tenNhaMay: facturyList.find(nm => nm.maNhaMay === plant.maNhaMay)?.tenNhaMay || null,
            }));
            setList(mergedData);
            setFilteredList(mergedData); // khởi tạo giá trị ban đầu
        }
    }, [plantList, productList, facturyList]);

    const handleDateChange = (e) => {
        const selected = e.target.value;
        setSelectedDate(selected);

        const filtered = list.filter(item =>
            item.ngayBatDauDuKien && item.ngayBatDauDuKien.slice(0, 10) === selected
        );
        setFilteredList(filtered);
    };

    const doubleClickRow = (item) => {
        navigate('/manfacturing/detail', { state: { item } });
    };

    const clickCreatePlant = () => {
        navigate("/manfacturingorders/create");
    };

    return (
        <div>
            <div className="product-header">Manfacturing Orders</div>
            <div className="manfactring-button-row">
                <button className='manfacturing-new-button' onClick={clickCreatePlant}>New</button>
                <input className='manfacturing-filter-input' />
                <button className='manfacturing-search-button'><FaSearch /></button>
                
                {/* Lọc theo ngày */}
                <input
                    type="date"
                    className='manfacturing-select'
                    value={selectedDate}
                    onChange={handleDateChange}
                />
            </div>

            <table className='manfacturing-table'>
                <thead>
                    <tr className='manfacturing-table-title'>
                        <th>Plan ID</th>
                        <th>Owner</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Start Date</th>
                        <th>Creator</th>
                        <th>Factory</th>
                        <th>State</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredList.map((item, index) => (
                        <tr
                            key={index}
                            style={{
                                backgroundColor:
                                    hoveredRowIndex === index
                                        ? "#C0C0C0"
                                        : index % 2 !== 0
                                            ? "#D1E8FE"
                                            : "#ffffff",
                                transition: "background-color 0.3s",
                            }}
                            className="manfacturing-row"
                            onMouseEnter={() => setHoveredRowIndex(index)}
                            onMouseLeave={() => setHoveredRowIndex(null)}
                            onDoubleClick={() => doubleClickRow(item)}
                        >
                            <td title={item.maKeHoach}>{item.maKeHoach}</td>
                            <td className='blue-color'>{item.nguoiTao}</td>
                            <td>{item.tenSanPham}</td>
                            <td>{item.soLuong}</td>
                            <td>{item.ngayBatDauDuKien?.slice(0, 10)}</td>
                            <td>{item.nguoiTao}</td>
                            <td>{item.tenNhaMay}</td>
                            <td>
                                <div
                                    style={{
                                        backgroundColor:
                                            item.trangThai === "Ready" ? "#18A2B8"
                                            : item.trangThai === "Inprogress" ? "#1FA9FD"
                                            : item.trangThai === "Block" ? "#EE0000"
                                            : "#339900",
                                        color: "white",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                    }}
                                >
                                    {item.trangThai}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {loading && <Loading />}
        </div>
    );
};

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

export default Manfacturingorders