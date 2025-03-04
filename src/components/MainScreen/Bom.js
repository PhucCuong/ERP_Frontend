import './Bom.css'
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from 'react';
import { FaPencil } from "react-icons/fa6";

import axios from 'axios';


const Bom = () => {

    // 4 mảng gọi api
    const [productId, setProductId] = useState('')
    const [products, setProducts] = useState([])
    const [materials, setMaterials] = useState([])
    const [boms, setBoms] = useState([])


    const [bomListDuplicate, setBomListDuplicate] = useState([])  // array trùng lặp tên sản phẩm

    const [bomDetailList, setBomDetailList] = useState([])  // mảng chứa các định mức nguyên vật liệu của 1 Bom cụ thể (BẢNG của màn hình bên phải)

    // các biến để hiển thị ra thẻ input bên phải
    const [productName, setProductName] = useState('')
    const [quantity, setQuantity] = useState(0)
    const [unit, setUnit] = useState('')

    useEffect(() => {
        axios.get('https://localhost:7135/api/SanPhamx')
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

        axios.get('https://localhost:7135/api/NguyenVatLieux')
            .then(response => {
                setMaterials(response.data)
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });

        axios.get('https://localhost:7135/api/DinhMucNguyenVatLieux')
            .then(response => {
                setBoms(response.data)
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });
    }, [])
    console.log(bomDetailList)
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
        products.map(product => 
        {
            boms.map(bom => {
                materials.map(material => {
                    if (bom.maSanPham === products[0].maSanPham && bom.maNguyenVatLieu === material.maNguyenVatLieu) {
                        arr.push({
                            materialCode: material.maNguyenVatLieu,
                            materialsName: material.tenNguyenVatLieu,
                            quantity: bom.soLuong
                        })
                    }
                })
            })
        }
        )
        setBomDetailList(arr)
    }, [products, materials, boms])
    

    //     {
    //         "maDinhMuc": 1,
    //         "tenSanPham": "Bàn làm việc",
    //         "nguyenVatLieus": [
    //             {
    //                 "maNguyenVatLieu": 1,
    //                 "tenNguyenVatLieu": "Ốc vít",
    //                 "soLuong": 20
    //             },
    //             {
    //                 "maNguyenVatLieu": 2,
    //                 "tenNguyenVatLieu": "Gỗ",
    //                 "soLuong": 10
    //             },
    //             {
    //                 "maNguyenVatLieu": 3,
    //                 "tenNguyenVatLieu": "Keo",
    //                 "soLuong": 13
    //             }
    //         ],
    //         "soLuong": 2,
    //         "mucDoSuDung": 'Nhiều',
    //         "thoiGianSanXuat": '20h',
    //         "ngayTao": '12-12/2012',
    //         "ngayChinhSua": '12-12/2012'
    //     },
    //     {
    //         "maDinhMuc": 2,
    //         "tenSanPham": "Ghế công thái học",
    //         "nguyenVatLieus": [
    //             {
    //                 "maNguyenVatLieu": 2,
    //                 "tenNguyenVatLieu": "Ốc vít",
    //                 "soLuong": 24
    //             },
    //             {
    //                 "maNguyenVatLieu": 4,
    //                 "tenNguyenVatLieu": "Gỗ",
    //                 "soLuong": 23
    //             },
    //             {
    //                 "maNguyenVatLieu": 6,
    //                 "tenNguyenVatLieu": "Keo",
    //                 "soLuong": 34
    //             }
    //         ],
    //         "soLuong": 4,
    //         "mucDoSuDung": 'Nhiều',
    //         "thoiGianSanXuat": '20h',
    //         "ngayTao": '12-12/2012',
    //         "ngayChinhSua": '12-12/2012'
    //     },
    //     {
    //         "maDinhMuc": 3,
    //         "tenSanPham": "Kệ màn hình",
    //         "nguyenVatLieus": [
    //             {
    //                 "maNguyenVatLieu": 3,
    //                 "tenNguyenVatLieu": "Ốc vít",
    //                 "soLuong": 34
    //             },
    //             {
    //                 "maNguyenVatLieu": 6,
    //                 "tenNguyenVatLieu": "Gỗ",
    //                 "soLuong": 21
    //             },
    //             {
    //                 "maNguyenVatLieu": 4,
    //                 "tenNguyenVatLieu": "Keo",
    //                 "soLuong": 15
    //             }
    //         ],
    //         "soLuong": 5,
    //         "mucDoSuDung": 'Nhiều',
    //         "thoiGianSanXuat": '20h',
    //         "ngayTao": '12-12/2012',
    //         "ngayChinhSua": '12-12/2012'
    //     },
    // ]


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
                        materialCode: material.maNguyenVatLieu,
                        materialsName: material.tenNguyenVatLieu,
                        quantity: bom.soLuong
                    })
                }
            })
        })
        setBomDetailList(arr)
    }
    return (
        <div className='bom-container'>
            <div className='bom-header'>
                Bill Of Material
            </div>
            <div className='bom-content'>
                <div className='bom-filter-row'>
                    <button className='create-bom-btn'>New</button>
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
                                products.map(item => (
                                    <div className='bom-item-row' onClick={() => getBomDetailFromProductCode(item)}
                                        style={{ backgroundColor: productId === item.maSanPham ? '#C0C0C0' : '#ffffff' }}
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
                            </div>
                            <div>
                                {
                                    bomDetailList.map((item, index) => (
                                        <div
                                            className='bom-detail-table-row'
                                            style={{ backgroundColor: index % 2 !== 0 ? '#EFEFEF' : '#ffffff' }}
                                        >
                                            <div>{item.materialsName}</div>
                                            <div>{item.quantity}</div>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className='add-line-table'>Add a line</div>
                        </div>
                        <button className='bom-detail-save-button'>Save</button>
                    </div>

                </div>
            </div>
            <div></div>
        </div>
    )
}

export default Bom