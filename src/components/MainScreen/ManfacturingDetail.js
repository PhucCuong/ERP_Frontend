import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import axios from 'axios';
import './ManfacturingDetail.css'
import Spinner from 'react-bootstrap/Spinner';
import { ToastContainer, toast } from 'react-toastify';
import { FaRegTrashAlt } from "react-icons/fa";

const ManfacturingDetail = ({ userName }) => {

    const navigate = useNavigate();

    // biến mã sản phẩm để lấy định mức nguyên vật liệu
    const [productId, setProductId] = useState(null)

    // list call api
    const [bomList, setBomList] = useState(null)
    const [materials, setMaterials] = useState(null)


    // biến để lấy định mức nguyên vật liệu của MỘT sản phẩm đó
    const [components, setComponents] = useState([])
    // nhận tham số truyền vào
    const location = useLocation();
    const item = location.state?.item;

    // biến lưu danh sách lệnh sản xuất
    const [workOrders, setWorkOrders] = useState([])

    // biến lưu trạng thái modal
    const [isOpenModal, setIsOpenModal] = useState(false)


    // biến lưu đóng mở modal xác nhận xóa work order
    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    // biến lưu mã lệnh sản xuát bị xóa để truyền vào modal delete
    const [workOrderDeleteId, setWorkOrderDeleteId] = useState('')

    //const [filteredProcesses, setFilteredProcesses] = useState([]);
    const [lenhSanXuat, setLenhSanXuat] = useState([])

    useEffect(() => {
        setProductId(item.maSanPham)
        callApiGetBomList()
        callApiGetMaterials()
        setComponents([])


        // gọi workorder đã được lọc theo plant từ backend
        callGetWorkOrderListByPlantCode()
    }, [])

    useEffect(() => {
        if (bomList !== null && materials !== null) {
            var mergeData = []
            bomList.map((bom, index) => {
                if (bom.maSanPham === productId) {
                    mergeData.push({
                        ...bom,
                        tenNguyenVatLieu: materials.find(material => bom.maNguyenVatLieu === material.maNguyenVatLieu)?.tenNguyenVatLieu || null,
                        donViTinh: materials.find(material => bom.maNguyenVatLieu === material.maNguyenVatLieu)?.donViTinh || null,
                    })
                }
            })
            setComponents(mergeData);
        }
    }, [bomList, materials])

    const callGetWorkOrderListByPlantCode = () => {
        axios.get(`https://localhost:7135/api/LenhSanXuatx/get-workorder-list-by-plant-code/${Number(item.maKeHoach.substring(5,10))}`)
            .then(response => {
                setLenhSanXuat(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    const callApiGetBomList = () => {
        axios.get('https://localhost:7135/api/DinhMucNguyenVatLieux')
            .then(response => {
                setBomList(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    const callApiGetMaterials = () => {
        axios.get('https://localhost:7135/api/NguyenVatLieux')
            .then(response => {
                setMaterials(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    // biến makehoach từ 4 thành 'KHSX/00004'
    function formatMaKeHoach(number) {
        return `KHSX/${number.toString().padStart(5, '0')}`;
    }

    const clickBackManfacturingOrders = () => {
        navigate('/manfacturingorders')
    }

    const openModal = () => {
        setIsOpenModal(true)
    }

    const deleteWorkOrder = (work_order_delete_id) => {
        setWorkOrderDeleteId(work_order_delete_id)
        setIsShowDeleteModal(true)
    }

    return (
        <div>
            <div className="header">View Manfacturing Order</div>
            <button className='manfacturing-detail-close-button' onClick={() => clickBackManfacturingOrders()}>
                <IoMdClose className='manfacturing-detail-close-icon' />
            </button>
            <div className='manfacturing-detail-info'>
                <div className='manfacturing-detail-column'>
                    <div className='man-det-info-row'>
                        <div className='bold'>Product :</div>
                        <div className='man-det-info-value primary-color'>{item.tenSanPham}</div>
                    </div>
                    <div className='man-det-info-row'>
                        <div className='bold'>Quantity :</div>
                        <div className='man-det-info-value primary-color'>{item.soLuong}</div>
                    </div>
                </div>

                <div className='manfacturing-detail-column'>
                    <div className='man-det-info-row'>
                        <div className='bold'>Start Date :</div>
                        <div className='man-det-info-value green-color'>{item.ngayTao.slice(0, 10)}</div>
                    </div>
                    <div className='man-det-info-row'>
                        <div className='bold'>Responsible :</div>
                        <div className='man-det-info-value primary-color'>{item.nguoiTao}</div>
                    </div>
                    <div className='man-det-info-row'>
                        <div className='bold'>Status :</div>
                        <div className='man-det-info-value'
                            style={{
                                color:
                                    item.trangThai === "Ready"
                                        ? "#18A2B8"
                                        : item.trangThai === "Inprogress"
                                            ? "#1FA9FD"
                                            : item.trangThai === "Fail"
                                                ? "#EE0000"
                                                : "transparent", // Màu mặc định nếu không khớp
                                fontWeight: "bold", // Làm nổi bật chữ
                                textAlign: "center", // Căn giữa nội dung
                            }}
                        >{item.trangThai}</div>
                    </div>
                </div>
            </div>
            <div style={{
                fontSize: 23,
                textAlign: 'left',
                marginLeft: 70,
                marginTop: 20,
                color: '#18A2B8'
            }}>Bill of material :</div>
            <table className='man-det-table'>
                <thead>
                    <tr className='man-det-table-title'>
                        <th className='man-det-th'>Component</th>
                        <th className='man-det-th'>To Comsume</th>
                        <th className='man-det-th'>Unit</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        components.map((nvl, index) => (
                            <tr style={{ backgroundColor: index % 2 !== 0 ? '#EFEFEF' : '#FFFFFF' }}>
                                <td className='man-det-td' style={{ fontWeight: 600, color: '#3348A9' }}>{nvl.tenNguyenVatLieu}</td>
                                <td className='man-det-td' style={{ fontSize: 20 }}>{nvl.soLuong}</td>
                                <td className='man-det-td' style={{ fontSize: 20 }}>{nvl.donViTinh}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <div style={{
                fontSize: 23,
                textAlign: 'left',
                marginLeft: 70,
                marginTop: 20,
                color: '#18A2B8'
            }}>Work orders :</div>
            <table className='man-det-table'>
                <thead>
                    <tr className='man-det-table-title'>
                        <th className='man-det-th'>Work Orders Code</th>
                        <th className='man-det-th'> Work Orders Name</th>
                        <th className='man-det-th'>Plan Code</th>
                        <th className='man-det-th'>Process Name</th>
                        <th className='man-det-th'>Product</th>
                        <th className='man-det-th'>Quantity</th>
                        <th className='man-det-th'>Work Center</th>
                        <th className='man-det-th'>Start date</th>
                        <th className='man-det-th'>End date</th>
                        <th className='man-det-th'>Real duration</th>
                        <th className='man-det-th'>Manufacturing Supervisor</th>
                        <th className='man-det-th'>Status</th>
                        <th className='man-det-th'>Delete</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        lenhSanXuat.map((llv, index) => {
                            return (
                                <tr style={{ backgroundColor: index % 2 !== 0 ? '#EFEFEF' : '#FFFFFF' }}>
                                    <td title={llv.maLenh} style={{ width: 150, cursor: 'pointer', color: '#3E58CE' }} className='man-det-td' >{llv.maLenh}</td>
                                    <td title={llv.tenHoatDong} style={{ width: 150, cursor: 'pointer', color: '#3E58CE' }} className='man-det-td' >{llv.tenHoatDong}</td>
                                    <td title={llv.maKeHoach} style={{ width: 150, cursor: 'pointer', color: '#3E58CE' }} className='man-det-td' >KHSX/{llv.maKeHoach.toString().padStart(5,'0')}</td>
                                    <td title={llv.tenQuyTrinh} style={{ width: 150, cursor: 'pointer', color: '#3E58CE' }} className='man-det-td' >{llv.tenQuyTrinh}</td>
                                    <td className='man-det-td' style={{ width: 200 }}>
                                        {
                                            llv.tenSanPham
                                        }
                                    </td>
                                    <td className='man-det-td' >{llv.soLuong}</td>
                                    <td className='man-det-td' >{llv.khuVucSanXuat}</td>
                                    <td className='man-det-td' style={{ width: 100, color: '#FF3399' }}>{llv.ngayBatDau.slice(0, 10)}</td>
                                    <td className='man-det-td' style={{ width: 100, color: '#FF3399' }}>{llv.ngayKetThuc.slice(0, 10)}</td>
                                    <td className='man-det-td' ></td>
                                    <td className='man-det-td' style={{ color: '#18A2B8', fontWeight: 'bold' }}>{llv.nguoiChiuTrachNhiem}</td>
                                    <td className='man-det-td' >
                                        <div
                                            className='man-det-td'
                                            style={{
                                                backgroundColor:
                                                    llv.trangThai === "Ready"
                                                        ? "#18A2B8"
                                                        : llv.trangThai === "Inprogress"
                                                            ? "#FFFF66"
                                                            : llv.trangThai === "Block"
                                                                ? "#BB0000"
                                                                : "transparent", // Màu mặc định nếu không khớp
                                                color: "white", // Đổi màu chữ để dễ đọc hơn
                                                fontWeight: "bold", // Làm nổi bật chữ
                                                textAlign: "center", // Căn giữa nội dung
                                                width: 50
                                            }}
                                        >
                                            {llv.trangThai}
                                        </div>
                                    </td>
                                    <td>
                                        <button className='md-delete-btn' onClick={() => deleteWorkOrder(llv.maLenh)}
                                            style={{
                                                backgroundColor: (index % 2 !== 0) ? '#ffffff' : '#F0F0F0'
                                            }}
                                        ><FaRegTrashAlt /></button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    <div className='add-workorder' onClick={() => openModal()}>Add work order</div>
                </tbody>
            </table>

            {isOpenModal && <AddWorkOrderModal setIsOpenModal={setIsOpenModal} maKeHoach={item.maKeHoach}
                maSanPham={item.maSanPham} userName={userName} setLenhSanXuat={setLenhSanXuat}
            />
            }
            {
                isShowDeleteModal && <ConfirmDeleteModal setIsShowDeleteModal={setIsShowDeleteModal}
                    workOrderDeleteId={workOrderDeleteId} setLenhSanXuat={setLenhSanXuat} maKeHoach={item.maKeHoach}
                />
            }
        </div>
    )
}

const AddWorkOrderModal = ({ setIsOpenModal, maKeHoach, maSanPham, userName, setLenhSanXuat }) => {
    const [formData, setFormData] = useState({
        maKeHoach: '',
        maQuyTrinh: '',
        maSanPham: '',
        soLuong: 0,
        ngayBatDau: '',
        ngayKetThuc: '',
        trangThai: 'Ready',
        nguoiChiuTrachNhiem: '',
        khuVucSanXuat: '',
    });
    console.log(maKeHoach)
    const [loading, setLoading] = useState(false);
    const [plants, setPlant] = useState([]);
    const [processes, setProcesses] = useState([]);
    const [products, setProducts] = useState([]);
    const [factorys, setFactorys] = useState([]);
    const [filteredProcesses, setFilteredProcesses] = useState([]);
    const [productName, setProductName] = useState('');

    useEffect(() => {
        axios.get('https://localhost:7135/api/KeHoachSanXuatx')
            .then(response => {
                setPlant(response.data);
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });

        axios.get('https://localhost:7135/api/QuyTrinhSanXuatx')
            .then(response => {
                setProcesses(response.data);
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });

        axios.get('https://localhost:7135/api/SanPhamx')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });

        axios.get('https://localhost:7135/api/NhaMayx')
            .then(response => {
                setFactorys(response.data);
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });
    }, []);

    useEffect(() => {
        const product = products.find(sp => sp.maSanPham.trim() === maSanPham.trim());
        if (product) {
            setProductName(product.tenSanPham);
        }
    }, [products, maSanPham]);

    useEffect(() => {
        if (maSanPham && processes.length > 0) {
            const filtered = processes.filter(process => process.maSanPham === maSanPham);
            setFilteredProcesses(filtered);
            // Tự động chọn quy trình đầu tiên nếu có
            if (filtered.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    maQuyTrinh: filtered[0].maQuyTrinh
                }));
            }
        }
    }, [maSanPham, processes]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        const formSunmit = {
            ...formData,
            maKeHoach: parseInt(maKeHoach.split('/')[1]),
            maSanPham,
            nguoiChiuTrachNhiem: userName
        };

        console.log(formSunmit)

        try {
            const res = await axios.post('https://localhost:7135/api/LenhSanXuatx/add-list-workorder', formSunmit);
            notify_success("Thêm các lệnh sản xuất thành công!");
            setLoading(false);

            const result = await axios.get(`https://localhost:7135/api/LenhSanXuatx/get-workorder-list-by-plant-code/${Number(maKeHoach.substring(5,10))}`);
            setLenhSanXuat(result.data);

            setTimeout(() => {
                setIsOpenModal(false);
            }, 1000);
        } catch (err) {
            setLoading(false);
            console.error("Chi tiết lỗi:", err);
            let errorMsg = 'Có lỗi xảy ra khi gửi yêu cầu!';

            if (err.response) {
                errorMsg += ` Server trả về mã lỗi ${err.response.status}`;
                if (typeof err.response.data === 'string') {
                    errorMsg += ` - ${err.response.data}`;
                } else if (err.response.data.message) {
                    errorMsg += ` - ${err.response.data.message}`;
                } else {
                    errorMsg += ` - ${JSON.stringify(err.response.data)}`;
                }
            } else if (err.request) {
                errorMsg += " Không nhận được phản hồi từ server.";
            } else {
                errorMsg += ` ${err.message}`;
            }

            notify_error(errorMsg);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Thêm Lệnh Sản Xuất</h2>
                <div className="form-grid">
                    <label>Mã kế hoạch:
                        <select name="maKeHoach" value={formData.maKeHoach}>
                            <option value="maKeHoach">{maKeHoach}</option>
                        </select><br />
                    </label>

                    <label>Sản Phẩm:
                        <select name="maSanPham" value={formData.productName}>
                            <option value="productName">{productName}</option>
                        </select><br />
                    </label>

                    <label>Quy Trình:
                        <select name="maQuyTrinh" value={formData.maQuyTrinh} onChange={handleChange} required>
                            {filteredProcesses.length > 0 ? (
                                filteredProcesses.map(qt => (
                                    <option key={qt.maQuyTrinh} value={qt.maQuyTrinh}>{qt.tenQuyTrinh}</option>
                                ))
                            ) : (
                                <option value="">Không có quy trình phù hợp</option>
                            )}
                        </select><br />
                    </label>

                    <label>Số Lượng:
                        <input name="soLuong" type="number" value={formData.soLuong} onChange={handleChange} />
                    </label>

                    <label>Ngày Bắt Đầu:
                        <input name="ngayBatDau" type="datetime-local" value={formData.ngayBatDau} onChange={handleChange} />
                    </label>

                    <label>Ngày Kết Thúc:
                        <input name="ngayKetThuc" type="datetime-local" value={formData.ngayKetThuc} onChange={handleChange} />
                    </label>

                    <label>Trạng Thái:
                        <select name="trangThai" value={formData.trangThai} onChange={handleChange}>
                            <option value="Ready">Ready</option>
                            <option value="Inprogress">Inprogress</option>
                            <option value="Block">Block</option>
                            <option value="Done">Done</option>
                        </select>
                    </label>

                    <label>Khu Vực Sản Xuất:
                        <select
                            name="khuVucSanXuat"
                            value={formData.khuVucSanXuat}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Chọn Nhà Máy --</option>
                            {factorys.map(nm => (
                                <option key={nm.maNhaMay} value={nm.tenNhaMay}>
                                    {nm.tenNhaMay}
                                </option>
                            ))}
                        </select>
                        <br />
                    </label>
                </div>

                <div className="modal-actions">
                    <button className='btn-cancel' onClick={() => setIsOpenModal(false)}>Hủy</button>
                    <button className='btn-send' onClick={handleSubmit}>Gửi</button>
                </div>
            </div>

            {loading && (
                <div className="loading-overlay">
                    <Spinner animation="grow" variant="primary" />
                </div>
            )}
            <ToastContainer theme="colored" />
        </div>
    );
};

const notify_success = (message) => toast.info(message, { type: "success" });
const notify_error = (message) => toast.info(message, { type: "error" });

const ConfirmDeleteModal = ({ setIsShowDeleteModal, workOrderDeleteId, setLenhSanXuat, maKeHoach }) => {

    const [loading, setLoading] = useState(false);

    const handleYes = async () => {
        setLoading(true);
        try {
            const id = Number(workOrderDeleteId.slice(4, 9))
            console.log(id)
            const res = await axios.delete(`https://localhost:7135/api/LenhSanXuatx/${id}`)

            notify_success('Deleted work order successfully!')
            setLoading(false);

            // rerender lại table work order
            // gọi lại API để lấy work order mới nhất
            const result = await axios.get(`https://localhost:7135/api/LenhSanXuatx/get-workorder-list-by-plant-code/${Number(maKeHoach.substring(5,10))}`);
            setLenhSanXuat(result.data);
        } catch (err) {
            setLoading(false);

            // In toàn bộ thông tin lỗi ra console
            console.error("Chi tiết lỗi:", err);

            let errorMsg = 'Có lỗi xảy ra khi gửi yêu cầu!';

            if (err.response) {
                console.error("Lỗi từ phía server (response):", err.response);
                errorMsg += ` Server trả về mã lỗi ${err.response.status}`;
                if (typeof err.response.data === 'string') {
                    errorMsg += ` - ${err.response.data}`;
                } else if (err.response.data.message) {
                    errorMsg += ` - ${err.response.data.message}`;
                } else {
                    errorMsg += ` - ${JSON.stringify(err.response.data)}`;
                }
            } else if (err.request) {
                // Request được gửi đi nhưng không nhận được response
                console.error("Yêu cầu đã gửi nhưng không có phản hồi (request):", err.request);
                errorMsg += " Không nhận được phản hồi từ server.";
            } else {
                // Lỗi xảy ra khi chuẩn bị request
                console.error("Lỗi khi tạo yêu cầu (message):", err.message);
                errorMsg += ` ${err.message}`;
            }

            notify_error(errorMsg);
        }
        setTimeout(() => {
            setIsShowDeleteModal(false)
        }, 1000);

    };

    const handleNo = () => {
        setIsShowDeleteModal(false)
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <p style={styles.message}>Do you want to delete this work order?</p>
                <div style={styles.buttons}>
                    <button style={styles.yesButton} onClick={handleYes}>Yes</button>
                    <button style={styles.noButton} onClick={handleNo}>No</button>
                </div>
            </div>

            {loading && (
                <div className="loading-overlay">
                    <Spinner animation="grow" variant="primary" />
                </div>
            )}
            <ToastContainer theme="colored" />
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    },
    modal: {
        backgroundColor: '#fff',
        padding: '20px 30px',
        borderRadius: '8px',
        textAlign: 'center',
        minWidth: '300px',
    },
    message: {
        fontSize: '18px',
        marginBottom: '20px',
    },
    buttons: {
        display: 'flex',
        justifyContent: 'space-around',
    },
    yesButton: {
        backgroundColor: '#d9534f',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    noButton: {
        backgroundColor: '#5bc0de',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer'
    }
};

export default ManfacturingDetail