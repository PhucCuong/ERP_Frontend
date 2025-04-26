import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
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

    const callGetWorkOrderListByPlantCode = async () => {
        await axios.get(`https://localhost:7135/api/LenhSanXuatx/get-workorder-list-by-plant-code/${Number(item.maKeHoach.substring(5, 10))}`)
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

    const clickBackManfacturingOrders = () => {
        const hasInprogress = lenhSanXuat.some(item => item.trangThai === "Inprogress");

        if (hasInprogress) {
            notify_error("Hãy tạm dừng lệnh sản xuất trước khi rời màn hình này !")
        } else {
            navigate('/manfacturingorders')
        }
    }

    const openModal = () => {
        setIsOpenModal(true)
    }

    const deleteWorkOrder = (work_order_delete_id) => {
        setWorkOrderDeleteId(work_order_delete_id)
        setIsShowDeleteModal(true)
    }

    // code nhấn nút bắt đầu , tạm dừng, kết thúc

    const [realTime, setRealTime] = useState(0)

    const parseLenhSx = (code) => {
        const numberPart = code.replace('LSX/', '');
        return parseInt(numberPart, 10);
    };

    function convertSecondsToDecimalMinutes(seconds) {
        const decimalMinutes = seconds / 60;
        return parseFloat(decimalMinutes.toFixed(2))
    }

    const convertMinutesToMinutesSeconds = (minutes) => {
        const totalSeconds = Math.floor(minutes * 60);
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    const [timers, setTimers] = useState({}); // Ví dụ: { 'maLenh001': 'running', 'maLenh002': 'paused' }

    const callApiChangeStatus = async (maLenh, status, currentState) => {
        var minutes
        if (currentState === "Ready") {
            minutes = 0
        } else {
            minutes = convertSecondsToDecimalMinutes(realTime)
        }

        var makhint = parseLenhSx(maLenh)
        const requestBody = {
            maLenh: makhint,
            trangThai: status,
            thoiGianThucTe: minutes
        }

        try {
            await axios.post('https://localhost:7135/api/LenhSanXuatx/update-status', requestBody)
        } catch (ex) {
            console.error('Lỗi khi gọi API:', ex);
        }
    }

    const callApiChanePlantStatus = async (makehoach, trangthai) => {
        var requestBody = {
            maKeHoach: makehoach,
            trangThai: trangthai
        }
        try {
            await axios.post('https://localhost:7135/api/KeHoachSanXuatx/update-status', requestBody)
        }
        catch (ex) {
            console.error('Lỗi khi gọi API:', ex);
        }
    }

    const handleStart = async (maLenh, trangthaithaydoi, trangthaihientai, thutu) => {
        setTimers(prev => ({ ...prev, [maLenh]: true }));

        await callApiChangeStatus(maLenh, trangthaithaydoi, trangthaihientai)



        if (thutu === 1) {
            var makh = Number(item.maKeHoach.substring(5, 10))
            callApiChanePlantStatus(makh, "Inprogress")
        }

        await callGetWorkOrderListByPlantCode()
    };

    const handlePause = async (maLenh, trangthaithaydoi, trangthaihientai) => {
        setTimers(prev => ({ ...prev, [maLenh]: false }));

        await callApiChangeStatus(maLenh, trangthaithaydoi, trangthaihientai)
        await callGetWorkOrderListByPlantCode()
    };

    const callApiNhapKho = async () => {
        var requestBody = {
            maKeHoach: item.maKeHoach,
            maSanPham: item.maSanPham,
            soLuongNhap: item.soLuong,
            ngayNhap: new Date().toISOString().split('T')[0],
            nguoiNhap: userName,
            trangThai: "Watting",
            moTa: "",
            ngayTao: new Date().toISOString().split('T')[0],
            ngayChinhSua: new Date().toISOString().split('T')[0]
        };
        try {
            await axios.post('https://localhost:7135/api/NhapKhox/add-list', requestBody)
        } catch (ex) {
            console.error('Lỗi khi gọi API:', ex);
        }
    }

    const handleStop = async (maLenh, trangthaithaydoi, trangthaihientai, thutu) => {
        setTimers(prev => ({ ...prev, [maLenh]: 'stopped' }));

        await callApiChangeStatus(maLenh, trangthaithaydoi, trangthaihientai)

        if (trangthaithaydoi === "Done" && lenhSanXuat.length === thutu) {
            var makh = Number(item.maKeHoach.substring(5, 10))
            callApiChanePlantStatus(makh, "Done")

            if (thutu === lenhSanXuat.length) {
                await callApiNhapKho()
            }
        }

        if (trangthaithaydoi === "Block") {
            var makh = Number(item.maKeHoach.substring(5, 10))
            callApiChanePlantStatus(makh, "Block")
        }

        await callGetWorkOrderListByPlantCode()
    };

    const handleStoppedTime = (maLenh, totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        // Gửi API cập nhật nếu cần
    };

    return (
        <div>
            <div className="header">
                Xem lệnh sản xuất</div>
            <button className='manfacturing-detail-close-button' onClick={() => clickBackManfacturingOrders()}>
                <IoMdClose className='manfacturing-detail-close-icon' />
            </button>
            <div className='manfacturing-detail-info'>
                <div className='manfacturing-detail-column'>
                    <div className='man-det-info-row'>
                        <div className='bold'>Sản phẩm :</div>
                        <div className='man-det-info-value primary-color'>{item.tenSanPham}</div>
                    </div>
                    <div className='man-det-info-row'>
                        <div className='bold'>Số lượng :</div>
                        <div className='man-det-info-value primary-color'>{item.soLuong}</div>
                    </div>
                </div>

                <div className='manfacturing-detail-column'>
                    <div className='man-det-info-row'>
                        <div className='bold'>Ngày bắt đầu :</div>
                        <div className='man-det-info-value green-color'>{item.ngayTao.slice(0, 10)}</div>
                    </div>
                    <div className='man-det-info-row'>
                        <div className='bold'>Người chịu trách nhiệm :</div>
                        <div className='man-det-info-value primary-color'>{item.nguoiTao}</div>
                    </div>
                    <div className='man-det-info-row'>
                        <div className='bold'>Trạng thái :</div>
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
                        <th className='man-det-th'>Thành phần</th>
                        <th className='man-det-th'>Số lượng</th>
                        <th className='man-det-th'>Đơn vị tính</th>
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
                        <th className='man-det-th'>Mã sản xuất</th>
                        <th className='man-det-th'>Lệnh sản xuất</th>
                        <th className='man-det-th'>Mã kế hoạch</th>
                        {/* <th className='man-det-th'>Process Name</th> */}
                        <th className='man-det-th'>Sản phẩm</th>
                        <th className='man-det-th'>Số lượng</th>
                        <th className='man-det-th'>Nhà máy</th>
                        <th className='man-det-th'>Ngày bắt đầu</th>
                        <th className='man-det-th'>Ngày kết thúc</th>
                        <th className='man-det-th'>Thời gian dự kiến</th>
                        <th className='man-det-th'>Thời gian Thực tế</th>
                        <th className='man-det-th'>Người kí</th>
                        <th className='man-det-th'>Trạng thái</th>
                        <th className='man-det-th'>Thaop tác</th>
                        <th className='man-det-th'>Xóa</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        lenhSanXuat.map((llv, index) => {

                            // const previousTrangThai = index > 0 ? lenhSanXuat[index - 1].trangThai : null;
                            // console.log(`index Hiện tại: ${index} | Trước đó: ${previousTrangThai}`);
                            // sau khi nhấn một nút acction cập nhật trạng thái status và gọi lại api để cập nhật bảng
                            return (
                                <tr style={{ backgroundColor: index % 2 !== 0 ? '#EFEFEF' : '#FFFFFF' }}>
                                    <td title={llv.maLenh} style={{ width: 150, cursor: 'pointer', color: '#3E58CE' }} className='man-det-td' >{llv.maLenh}</td>
                                    <td title={llv.tenHoatDong} style={{ width: 150, cursor: 'pointer', color: '#3E58CE', width: '15%' }} className='man-det-td' >{llv.tenHoatDong}</td>
                                    <td title={llv.maKeHoach} style={{ width: 150, cursor: 'pointer', color: '#3E58CE' }} className='man-det-td' >KHSX/{llv.maKeHoach.toString().padStart(5, '0')}</td>
                                    {/* <td title={llv.tenQuyTrinh} style={{ width: 150, cursor: 'pointer', color: '#3E58CE' }} className='man-det-td' >{llv.tenQuyTrinh}</td> */}
                                    <td className='man-det-td' style={{ width: 200 }}>
                                        {
                                            llv.tenSanPham
                                        }
                                    </td>
                                    <td className='man-det-td' >{llv.soLuong}</td>
                                    <td className='man-det-td' style={{ width: '15%' }}>{llv.khuVucSanXuat}</td>
                                    <td className='man-det-td' style={{ color: '#FF3399' }}>{llv.ngayBatDau}</td>
                                    <td className='man-det-td' style={{ color: '#FF3399' }}>{llv.ngayKetThuc}</td>
                                    <td className='man-det-td' style={{ width: '10%' }}>{convertMinutesToMinutesSeconds(llv.thoiGianDuKien)}</td>
                                    <td className='man-det-td' style={{ width: '10%' }}>
                                        <ThoiGianThucTeCell
                                            initialMinutes={llv.thoiGianThucTe}
                                            isRunning={timers[llv.maLenh]} // true / false / 'stopped'
                                            onStop={(totalSeconds) => handleStoppedTime(llv.maLenh, totalSeconds)}
                                            onTick={(totalSeconds) => setRealTime(totalSeconds)}
                                        />
                                    </td>
                                    <td className='man-det-td' style={{ color: '#18A2B8', fontWeight: 'bold' }}>{llv.nguoiChiuTrachNhiem}</td>
                                    <td className='man-det-td'>
                                        {
                                            (llv.thuTu > 1 &&
                                                llv.dieuKienBatDauGiaiDoanTiepTheo === "Khi tất cả hoàn thành" &&
                                                lenhSanXuat[index - 1]?.trangThai !== "Done")
                                                ?
                                                (
                                                    <div
                                                        className='man-det-td'
                                                        style={{
                                                            backgroundColor: '#00CCFF',
                                                            color: "white",
                                                            fontWeight: "bold",
                                                            textAlign: "center",
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            width: 120,
                                                            borderRadius: 20
                                                        }}
                                                    >
                                                        Watting Previous Step
                                                    </div>
                                                ) // hoặc <></>
                                                :
                                                (
                                                    <div
                                                        className='man-det-td'
                                                        style={{
                                                            backgroundColor:
                                                                llv.trangThai === "Ready"
                                                                    ? "#18A2B8"
                                                                    : llv.trangThai === "Inprogress"
                                                                        ? "#CCCC33"
                                                                        : llv.trangThai === "Block"
                                                                            ? "#BB0000"
                                                                            : llv.trangThai === "Done"
                                                                                ? "#339900"
                                                                                : "#808000",
                                                            color: "white",
                                                            fontWeight: "bold",
                                                            textAlign: "center",
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            width: 100,
                                                            borderRadius: 20
                                                        }}
                                                    >
                                                        {llv.trangThai}
                                                    </div>
                                                )
                                        }
                                    </td>

                                    <td className='man-det-td' >
                                        {
                                            (llv.thuTu > 1 &&
                                                llv.dieuKienBatDauGiaiDoanTiepTheo === "Khi tất cả hoàn thành" &&
                                                lenhSanXuat[index - 1]?.trangThai !== "Done")
                                                ?
                                                null
                                                :
                                                (
                                                    llv.trangThai === "Ready" ? <ReadyState handleStart={handleStart} maLenh={llv.maLenh} currentState={llv.trangThai} thuTu={llv.thuTu} /> :
                                                        llv.trangThai === "Inprogress" ? <InprogressState handlePause={handlePause} handleStop={handleStop} maLenh={llv.maLenh} currentState={llv.trangThai} thuTu={llv.thuTu} /> :
                                                            llv.trangThai === "Pause" ? <PauseState handleStart={handleStart} handleStop={handleStop} maLenh={llv.maLenh} currentState={llv.trangThai} thuTu={llv.thuTu} /> :
                                                                llv.trangThai === "Block" ? <BlockState /> : <div></div>
                                                )
                                        }
                                    </td>
                                    <td className='man-det-td' >
                                        {
                                            llv.trangThai === "Ready"
                                                ?
                                                <div>
                                                    <button className='md-delete-btn' onClick={() => deleteWorkOrder(llv.maLenh)}
                                                        style={{
                                                            backgroundColor: (index % 2 !== 0) ? '#ffffff' : '#F0F0F0'
                                                        }}
                                                    ><FaRegTrashAlt /></button>
                                                </div>
                                                :
                                                null
                                        }
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
            <ToastContainer theme="colored" />
        </div>
    )
}

const ThoiGianThucTeCell = ({ initialMinutes = 0, isRunning, onStop, onTick }) => {
    const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
    const intervalRef = useRef(null);

    // Start or pause timer
    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTotalSeconds(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isRunning]);

    useEffect(() => {
        onTick && onTick(totalSeconds);
    }, [totalSeconds]);

    // Gửi kết quả ra ngoài nếu kết thúc
    useEffect(() => {
        if (isRunning === 'stopped') {
            onStop && onStop(totalSeconds);
            clearInterval(intervalRef.current);
        }
    }, [isRunning]);

    const formatTime = () => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <td className='man-det-td' style={{ width: '10%', fontSize: 20, color: 'red', fontWeight: 'bold' }}>
            {formatTime()}
        </td>
    );
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

        const formSubmit = {
            maKeHoach: parseInt(maKeHoach.split('/')[1]),
            maSanPham: maSanPham,
            maQuyTrinh: formData.maQuyTrinh,
            soLuong: parseInt(formData.soLuong),
            ngayBatDau: formData.ngayBatDau,
            ngayKetThuc: formData.ngayKetThuc || null,
            trangThai: formData.trangThai,
            nguoiChiuTrachNhiem: userName,
            khuVucSanXuat: formData.khuVucSanXuat,
        };
        console.log("Payload gửi đi:", JSON.stringify(formSubmit, null, 2));

        console.log("Dữ liệu gửi backend:", formSubmit);

        try {
            const res = await axios.post('https://localhost:7135/api/LenhSanXuatx/add-list-workorder', formSubmit);
            notify_success("Thêm các lệnh sản xuất thành công!");
            setLoading(false);

            const result = await axios.get(`https://localhost:7135/api/LenhSanXuatx/get-workorder-list-by-plant-code/${Number(maKeHoach.substring(5, 10))}`);
            setLenhSanXuat(result.data);

            setTimeout(() => {
                setIsOpenModal(false);
            }, 500);
        } catch (err) {
            setLoading(false);
            console.error("Chi tiết lỗi:", err);

            let errorMsg = 'Có lỗi xảy ra khi gửi yêu cầu!';

            if (err.response) {
                let responseData = err.response.data;

                if (typeof responseData === 'string') {
                    // Nếu server trả về string, chỉ lấy dòng đầu tiên
                    errorMsg = responseData.split('\n')[0].trim();
                    // Nếu muốn đẹp hơn nữa, bỏ prefix "System.Exception:" nếu có
                    errorMsg = errorMsg.replace(/^System\.Exception:\s*/, '');
                } else if (responseData.message) {
                    errorMsg = responseData.message;
                } else {
                    errorMsg = JSON.stringify(responseData);
                }
            } else if (err.request) {
                errorMsg = 'Không nhận được phản hồi từ server.';
            } else {
                errorMsg = err.message;
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
                        <select name="maSanPham" value={formData.productName} onChange={handleChange}>
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
            const result = await axios.get(`https://localhost:7135/api/LenhSanXuatx/get-workorder-list-by-plant-code/${Number(maKeHoach.substring(5, 10))}`);
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
        }, 500);

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

const ReadyState = ({ handleStart, maLenh, currentState, thuTu }) => {
    return (
        <div>
            <button onClick={() => handleStart(maLenh, "Inprogress", currentState, thuTu)} className='btn-action' style={{ backgroundColor: '#33CCCC' }}>Start</button>
        </div>
    )
}

const InprogressState = ({ handlePause, handleStop, maLenh, currentState, thuTu }) => {
    return (
        <div>
            <button onClick={() => handlePause(maLenh, "Pause", currentState)} className='btn-action' style={{ backgroundColor: '#CCCC00', marginTop: 5 }}>Pause</button>
            <button onClick={() => handleStop(maLenh, "Block", currentState, thuTu)} className='btn-action' style={{ backgroundColor: '#CC3333', marginTop: 5 }}>Block</button>
            <button onClick={() => handleStop(maLenh, "Done", currentState, thuTu)} className='btn-action' style={{ backgroundColor: '#339900', marginTop: 5 }}>Done</button>
        </div>
    )
}

const PauseState = ({ handleStart, handleStop, maLenh, currentState, thuTu }) => {
    return (
        <div>
            <button onClick={() => handleStart(maLenh, "Inprogress", currentState)} className='btn-action' style={{ backgroundColor: '#FFCC33', marginTop: 5 }}>Continue</button>
            <button onClick={() => handleStop(maLenh, "Block", currentState, thuTu)} className='btn-action' style={{ backgroundColor: '#CC3333', marginTop: 5 }}>Block</button>
        </div>
    )
}

const BlockState = () => {
    return (
        <div>
            <button className='btn-action' style={{ backgroundColor: '#888888', marginTop: 5 }}>Return</button>
        </div>
    )
}

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