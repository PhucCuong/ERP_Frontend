import './Manfacturingorders.css'
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Manfacturingorders = () => {
    const navigate = useNavigate();
    const list = [
        {
            maKeHoach: 'KH001',
            maSanPham: '1',
            maNhaMay: 'NM001',
            maDinhMuc: 'DM1',
            soLuong: '1000',
            ngayBatDauDuKien: '2025-01-01',
            ngayKetThucDuKien: '2025-01-01',
            mucTonKhoAnToan: '300',
            soLuongSanXuatToiThieu: '100',
            soLuongSanXuatToiDa: '1000',
            trangThai: 'Done',
            nguoiTao: 'Thomas',
            ngayTao: '2025-01-01',
            nguoiChinhSua: 'Bill Gate',
            ngayChinhSua: ''
        },
        {
            maKeHoach: 'KH001',
            maSanPham: '1',
            maNhaMay: 'NM001',
            maDinhMuc: 'DM2',
            soLuong: '1000',
            ngayBatDauDuKien: '2025-01-01',
            ngayKetThucDuKien: '2025-01-01',
            mucTonKhoAnToan: '300',
            soLuongSanXuatToiThieu: '100',
            soLuongSanXuatToiDa: '1000',
            trangThai: 'Inprogress',
            nguoiTao: 'Thomas',
            ngayTao: '2025-01-01',
            nguoiChinhSua: 'Bill Gate',
            ngayChinhSua: ''
        },
        {
            maKeHoach: 'KH001',
            maSanPham: '1',
            maNhaMay: 'NM001',
            maDinhMuc: 'DM3',
            soLuong: '1000',
            ngayBatDauDuKien: '2025-01-01',
            ngayKetThucDuKien: '2025-01-01',
            mucTonKhoAnToan: '300',
            soLuongSanXuatToiThieu: '100',
            soLuongSanXuatToiDa: '1000',
            trangThai: 'Fail',
            nguoiTao: 'Thomas',
            ngayTao: '2025-01-01',
            nguoiChinhSua: 'Bill Gate',
            ngayChinhSua: ''
        },
        {
            maKeHoach: 'KH001',
            maSanPham: '1',
            maNhaMay: 'NM001',
            maDinhMuc: 'DM4',
            soLuong: '1000',
            ngayBatDauDuKien: '2025-01-01',
            ngayKetThucDuKien: '2025-01-01',
            mucTonKhoAnToan: '300',
            soLuongSanXuatToiThieu: '100',
            soLuongSanXuatToiDa: '1000',
            trangThai: 'Done',
            nguoiTao: 'Thomas',
            ngayTao: '2025-01-01',
            nguoiChinhSua: 'Bill Gate',
            ngayChinhSua: ''
        }
    ]

    const doubleClickRow = (item) => {
        navigate('/manfacturing/detail', { state: { item } })
    }

    return (
        <div>
            <div className="product-header">Manfacturing Orders</div>
            <div className="manfactring-button-row">
                <button className='manfacturing-new-button'>New</button>
                <input className='manfacturing-filter-input' />
                <button className='manfacturing-search-button'><FaSearch /></button>
                {/* <select value={selectedValue} onChange={handleChange}> */}
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
                        <th>Plan ID</th>
                        <th>Owner</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Start Date</th>
                        <th>Creator</th>
                        <th>Editor</th>
                        <th>State</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        list.map((item, index) => (
                            <tr style={{ backgroundColor: index % 2 !== 0 ? '#D1E8FE' : '#ffffff' }} className='manfacturing-row'>
                                <td onDoubleClick={() => doubleClickRow(item)}>{item.maKeHoach}</td>
                                <td onDoubleClick={() => doubleClickRow(item)} className='blue-color'>{item.nguoiTao}</td>
                                <td onDoubleClick={() => doubleClickRow(item)}>{item.maSanPham}</td>
                                <td onDoubleClick={() => doubleClickRow(item)}>{item.soLuong}</td>
                                <td onDoubleClick={() => doubleClickRow(item)}>{item.ngayBatDauDuKien}</td>
                                <td onDoubleClick={() => doubleClickRow(item)}>{item.ngayTao}</td>
                                <td onDoubleClick={() => doubleClickRow(item)}>{item.nguoiChinhSua}</td>
                                <td onDoubleClick={() => doubleClickRow(item)}>
                                    <div
                                        style={{
                                            backgroundColor:
                                                item.trangThai === "Done"
                                                    ? "#18A2B8"
                                                    : item.trangThai === "Inprogress"
                                                        ? "#1FA9FD"
                                                        : item.trangThai === "Fail"
                                                            ? "#EE0000"
                                                            : "transparent", // Màu mặc định nếu không khớp
                                            color: "white", // Đổi màu chữ để dễ đọc hơn
                                            fontWeight: "bold", // Làm nổi bật chữ
                                            textAlign: "center", // Căn giữa nội dung
                                        }}
                                    >
                                        {item.trangThai}
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Manfacturingorders