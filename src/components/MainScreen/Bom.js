import './Bom.css'
import { FaSearch } from "react-icons/fa";
import { useState, useEffect, useRef } from 'react';
import { FaPencil } from "react-icons/fa6";
import Spinner from 'react-bootstrap/Spinner';
import { ToastContainer, toast } from 'react-toastify';
import { BsXSquare } from "react-icons/bs";
import axios from 'axios';


const Bom = () => {

    // 4 mảng gọi api
    const [productId, setProductId] = useState('')
    const [products, setProducts] = useState([])
    const [materials, setMaterials] = useState([])
    const [boms, setBoms] = useState([])

    const [loading, setLoading] = useState(false);


    const [bomListDuplicate, setBomListDuplicate] = useState([])  // array trùng lặp tên sản phẩm

    const [bomDetailList, setBomDetailList] = useState([])  // mảng chứa các định mức nguyên vật liệu của 1 Bom cụ thể (BẢNG của màn hình bên phải)

    // hover từng dòng
    const [hoveredRowIndex, setHoveredRowIndex] = useState(null)

    // các biến để hiển thị ra thẻ input bên phải
    const [productName, setProductName] = useState('')
    const [quantity, setQuantity] = useState(0)
    const [unit, setUnit] = useState('')

    // biến để hiện modal thêm nguyên vật liệu
    const [isOpenModal, setIsOpenModal] = useState(false)

    useEffect(() => {
        setLoading(true)
        setInterval(() => {
            setLoading(false)
        }, 300);
        callapi()
    }, [])

    const callapi = async () => {
        await axios.get('https://localhost:7135/api/SanPhamx')
            .then(response => {
                setProducts(response.data)
                setProductName(response.data[0].tenSanPham)
                setQuantity(1)
                setUnit(response.data[0].donViTinh)
                setProductId(response.data[0].maSanPham)
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });

        await axios.get('https://localhost:7135/api/NguyenVatLieux')
            .then(response => {
                setMaterials(response.data)
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });

        await axios.get('https://localhost:7135/api/DinhMucNguyenVatLieux')
            .then(response => {
                setBoms(response.data)
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });
    }

    useEffect(() => {
        if (products.length !== 0 && materials.length !== 0 && boms.length !== 0) {
            const mergedData = boms.map(dinhMuc => ({
                ...dinhMuc,
                tenSanPham: products.find(sp => sp.maSanPham === dinhMuc.maSanPham)?.tenSanPham || null,
                tenNguyenVatLieu: materials.find(nvl => nvl.maNguyenVatLieu === dinhMuc.maNguyenVatLieu)?.tenNguyenVatLieu || null,
                donViTinh: products.find(sp => sp.maSanPham === dinhMuc.maSanPham)?.donViTinh || null,
            }));
            setBomListDuplicate(mergedData)
        }

        // cho lần mount đầu tiên là định mức nguyên vật liệu của sản phẩm đầu tiên
        var arr = []
        products.map((product, index) => {
            boms.map(bom => {
                materials.map(material => {
                    if (index === 0 && bom.maSanPham === product.maSanPham && bom.maNguyenVatLieu === material.maNguyenVatLieu) {
                        arr.push({
                            bomCode: bom.maDinhMuc,
                            materialCode: material.maNguyenVatLieu,
                            materialsName: material.tenNguyenVatLieu,
                            quantity: bom.soLuong
                        })
                    }
                })
            })
        })
        setBomDetailList(arr)
    }, [products, materials, boms])


    // hàm nhấn vào một dòng của Bom
    const getBomDetailFromProductCode = (product) => {
        setProductId(product.maSanPham)
        setProductName(product.tenSanPham)
        setQuantity(1)
        setUnit(product.donViTinh)
        var arr = []
        boms.map(bom => {
            materials.map(material => {
                if (bom.maSanPham === product.maSanPham && bom.maNguyenVatLieu === material.maNguyenVatLieu) {
                    arr.push({
                        bomCode: bom.maDinhMuc,
                        materialCode: material.maNguyenVatLieu,
                        materialsName: material.tenNguyenVatLieu,
                        quantity: bom.soLuong
                    })
                }
            })
        })
        setBomDetailList(arr)
    }

    const deleteMaterialOfBom = async (bomid) => {
        
        await axios.delete(`https://localhost:7135/api/DinhMucNguyenVatLieux/${bomid}`)
        .then(response => {
            notify_success('Xóa thành công.')
            callapi()
        })
        .catch(error => {
            notify_error('Xóa thất bại : ', error.message)
        })
    }
    return (
        <div className='bom-container'>
            <div className='bom-header'>
                Bill Of Material
            </div>
            <div className='bom-content'>
                <div className='bom-filter-row'>
                    {/* <button className='create-bom-btn'>New</button> */}
                    <input className='bom-filter-input' placeholder='Search.....' />
                    <FaSearch className='search-icon' />
                </div>
                <div className='bom-content-row'>
                    <div className='bom-list'>
                        <div className='bom-list-title-row'>
                            <div className='bom-list-title bom-list-title-left'>Product</div>
                            <div className='bom-list-title bom-list-right'>Unit</div>
                        </div>
                        <div style={{ overflowY: 'auto', height: 600 }}>
                            {
                                products.map((item, index) => (
                                    <div className='bom-item-row' onClick={() => getBomDetailFromProductCode(item)}
                                        //style={{ backgroundColor: productId === item.maSanPham ? '#C0C0C0' : '#ffffff' }}
                                        onMouseEnter={() => setHoveredRowIndex(index)}
                                        onMouseLeave={() => setHoveredRowIndex(null)}
                                        style={{
                                            backgroundColor:
                                                hoveredRowIndex === index
                                                    ? "#C0C0C0" // Màu khi hover
                                                    : index % 2 !== 0
                                                        ? "#D1E8FE" // Màu nền xen kẽ
                                                        : "#ffffff",
                                            transition: "background-color 0.3s", // Hiệu ứng mượt mà
                                        }}
                                    >
                                        <div>{item.tenSanPham}</div>
                                        <div>{item.donViTinh}</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>


                    {/* bom detail */}
                    <div className='bom-detail'>
                        <div className='bom-detail-title'>Bom Detail</div>
                        <div className='bom-detail-row'>
                            <div className='bom-detail-label'>Product</div>
                            <input className='bom-detail-input' value={productName} />
                            <FaPencil className='pencil-icon' />
                        </div>
                        <div className='bom-detail-row'>
                            <div className='bom-detail-label'>Quantity</div>
                            <input className='bom-detail-input' value={quantity} />
                            <FaPencil className='pencil-icon' />
                        </div>
                        <div className='bom-detail-row'>
                            <div className='bom-detail-label'>Unit</div>
                            <input className='bom-detail-input' value={unit} />
                            <FaPencil className='pencil-icon' />
                        </div>
                        <div className='bom-detail-title' style={{ marginTop: 50 }}>Components</div>
                        <div className='bom-detail-table'>
                            <div className='bom-detail-table-title'>
                                <div>Component</div>
                                <div>Quantity</div>
                                <div>Action</div>
                            </div>
                            <div className='tableBody'>
                                {
                                    bomDetailList.map((item, index) => (
                                        <div
                                            className='bom-detail-table-row'
                                            style={{ backgroundColor: index % 2 !== 0 ? '#EFEFEF' : '#ffffff'}}
                                        >
                                            <div>{item.materialsName}</div>
                                            <div style={{marginLeft: 40}}>{item.quantity}</div>
                                            <button className='delete-row' onClick={() => deleteMaterialOfBom(item.bomCode)}>X</button>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className='add-line-table' onClick={() => setIsOpenModal(true)}>Add a line</div>
                        </div>

                        {isOpenModal && <ModalAddMaterial setIsOpenModal={setIsOpenModal} productId={productId} setLoading={setLoading} callapi={callapi} />}
                    </div>

                </div>
            </div>

            {loading && <Loading />} {/* Hiển thị Loading khi đang xử lý */}
            <ToastContainer theme="colored" />
        </div>
    )
}

const notify_success = (message) => toast.info(message, {
    type: "success"
});

const notify_error = (message) => toast.info(message, {
    type: "error"
});

const ModalAddMaterial = ({ setIsOpenModal, productId, setLoading, callapi }) => {

    const quantityRef = useRef(null)

    const [selectedValue, setSelectedValue] = useState("");

    // biến lưu danh sách NVL render ra thẻ select
    const [materialList, setMaterialList] = useState([])

    const [hoverSaveButton, setHoverSaveButton] = useState(false)

    useEffect(() => {
        axios.get('https://localhost:7135/api/NguyenVatLieux')
            .then(response => {
                setMaterialList(response.data)
            })
            .catch(error => {
                console.log(error.message)
            })
    }, [])

    function getFormattedDate() {
        const now = new Date();

        // Lấy từng phần của ngày giờ
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");

        // Lấy mili-giây và chuyển thành 7 chữ số thập phân
        const milliseconds = String(now.getMilliseconds()).padStart(3, "0") + "0000"; // Thêm 4 số 0 để đủ 7 số

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
    }

    const addMaterial = () => {

        const ngaytao = getFormattedDate()
        const requestBody = {
            maSanPham: productId,
            maNguyenVatLieu: selectedValue,
            soLuong: quantityRef.current.value,
            mucDoSuDung: 'Nhiều',
            ngayTao: ngaytao,
        }

        axios.post('https://localhost:7135/api/DinhMucNguyenVatLieux', requestBody)
            .then(response => {
                setLoading(true)
                setInterval(() => {
                    setLoading(false)
                }, 300);
                notify_success('thêm thành công.')
                callapi()
                setIsOpenModal(false)
            })
            .catch(error => {
                notify_error('Thêm thất bại : ' + error.message)
            })
    }

    return (
        <div
            className='modal-add'
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.5)',
                position: 'fixed',
                top: 0,
                left: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <div style={{
                width: '50%',
                height: '40%',
                backgroundColor: '#fff',
                position: 'relative',
                paddingBottom: 20
            }}>
                <button
                    className='btn-exit'
                    style={{
                        position: 'absolute',
                        top: 0,
                        height: 30
                    }}
                    onClick={() => setIsOpenModal(false)}
                >
                    <BsXSquare />
                </button>
                <div style={{
                    color: '#3E58CE',
                    fontWeight: 'bold',
                    fontSize: 24,
                    marginTop: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    height: '100%'
                }}>
                    <div>Thêm nguyên vật liệu vào Bom</div>
                    <div style={{
                        marginTop: 40,
                        display: 'flex',
                        justifyContent: 'space-around'
                    }}>
                        <label style={{
                            color: '#000'
                        }}>
                            Chọn nguyên vật liệu
                        </label>
                        <select value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}
                            style={{
                                width: '50%',
                                fontSize: 20,
                                paddingLeft: 20,
                                paddingRight: 20
                            }}
                        >
                            <option value="">--Chọn--</option>
                            {
                                materialList.map((item, index) => (
                                    <option key={index} value={item.maNguyenVatLieu}>
                                        {item.tenNguyenVatLieu}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    <div
                        style={{
                            marginTop: 40,
                            display: 'flex',
                            justifyContent: 'space-around'
                        }}
                    >
                        <label style={{
                            color: '#000'
                        }}>
                            Nhập số lượng
                        </label>
                        <input
                            style={{
                                width: '50%',
                                paddingLeft: 20,
                                paddingRight: 20,
                                fontSize: 20,
                            }}
                            ref={quantityRef}
                        />
                    </div>
                    <button
                        style={{
                            width: '15%',
                            marginLeft: '80%',
                            borderWidth: 0,
                            backgroundColor: hoverSaveButton ? '#C0C0C0' : '#17A28D',
                            color: '#fff'
                        }}
                        onMouseEnter={() => setHoverSaveButton(true)}
                        onMouseLeave={() => setHoverSaveButton(false)}
                        onClick={() => addMaterial()}
                    >Save</button>
                </div>
            </div>
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

export default Bom