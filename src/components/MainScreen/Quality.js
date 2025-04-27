import Spinner from 'react-bootstrap/Spinner';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
const Quality = () => {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]); // lưu tất cả sản phẩm từ api
    const [searchTerm, setSearchTerm] = useState(""); // từ khóa tìm kiếm

    const callApiGetSanPhamTrongKho = async () => {
        try {
            const response = await axios.get('https://localhost:7135/api/NhapKhox/check-quality');
            setProducts(response.data);
            setAllProducts(response.data);
        } catch (ex) {
            console.log(ex);
        }
    };

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 300);

        callApiGetSanPhamTrongKho();
    }, []);

    const handleSearch = (e) => {
        const keyword = e.target.value;
        setSearchTerm(keyword);

        if (keyword.trim() === "") {
            setProducts(allProducts);
        } else {
            const filtered = allProducts.filter(product =>
                product.tenSanPham.toLowerCase().includes(keyword.toLowerCase())
            );
            setProducts(filtered);
        }
    };

    const handleUpdateStatus = async (soseri, trangthai) => {
        var requestBody = {
            soseri: soseri,
            trangThai: trangthai
        }
        try {
            await axios.post('https://localhost:7135/api/NhapKhox/update-status', requestBody)
            notify_success('Đánh giá sản phẩm thành công')
        } catch (ex) {
            notify_error('Đánh giá sản phẩm thất bại : ', ex.message)
        }
        callApiGetSanPhamTrongKho()
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>Kiểm tra chất lượng</h2>

            {/* Thanh tìm kiếm */}
            <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                <input
                    type="text"
                    placeholder="Tìm theo tên sản phẩm..."
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        width: "300px",
                    }}
                />
            </div>

            <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>Số Seri</th>
                        <th>Tên Sản Phẩm</th>
                        <th>Ngày Nhập</th>
                        <th>Người Nhập</th>
                        <th>Trạng thái</th>
                        <th>Đánh giá</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                        products.map((item, index) => (
                            <tr key={item.soseri}>
                                <td>{item.soseri}</td>
                                <td>{item.tenSanPham}</td>
                                <td>{new Date(item.ngayNhap).toLocaleString()}</td>
                                <td>{item.nguoiNhap}</td>
                                <td
                                    style={{
                                        color: item.trangThai === "Watting"
                                            ?
                                            "#FF00FF"
                                            : item.trangThai === "Passed" ? "#009900"
                                                : "#FF3300"

                                    }}
                                >{item.trangThai}</td>
                                <td>
                                    {
                                        item.trangThai === "Watting"
                                            ?
                                            <div>
                                                <button style={{
                                                    padding: "6px 12px",
                                                    marginRight: "8px",
                                                    backgroundColor: "#4CAF50",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "6px",
                                                    cursor: "pointer",
                                                    fontWeight: "bold"
                                                }}
                                                    onClick={() => handleUpdateStatus(item.soseri, 'Passed')}
                                                >
                                                    Đạt
                                                </button>
                                                <button style={{
                                                    padding: "6px 12px",
                                                    backgroundColor: "#f44336",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "6px",
                                                    cursor: "pointer",
                                                    fontWeight: "bold"
                                                }}
                                                    onClick={() => handleUpdateStatus(item.soseri, 'Failed')}
                                                >
                                                    Không đạt
                                                </button>
                                            </div>
                                            :
                                            null
                                    }
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center" }}>Không có dữ liệu</td>
                        </tr>
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

const notify_success = (message) => toast.info(message, { type: "success" });
const notify_error = (message) => toast.info(message, { type: "error" });

export default Quality