import { useState, useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import { AiOutlineClose } from "react-icons/ai";
import { ToastContainer, toast } from 'react-toastify';



import './Product.css'

const Product = () => {

    const navigate = useNavigate();

    const [maSanPham, setMaSanPham] = useState('')
    const [products, setProducts] = useState([])
    const [images, setImages] = useState([])
    const [productList, setProductList] = useState([])
    const [loading, setLoading] = useState(false);

    // hover từng dòng
    const [hoveredRowIndex, setHoveredRowIndex] = useState(null);

    useEffect(() => {
        setLoading(true)
        setInterval(() => {
            setLoading(false)
        }, 300);
        callApiGetProducts()
        callApiGetProductImgs()
    }, [])

    useEffect(() => {
        const mergedArray = products.map(product => {
            const matchedImage = images.filter(img => img.maSanPham === product.maSanPham)
            return {
                ...product,
                img: matchedImage.map(img => img.imgUrl) // Trả về danh sách URL của tất cả ảnh
            };
        });
        setProductList(mergedArray)
    }, [products, images])



    const clickToDetail = (product) => {
        setMaSanPham(product.maSanPham)
    }

    const clickCreateProduct = () => {
        navigate("/products/create");
    }

    const callApiGetProducts = async () => {
        try {
            const response = await axios.get("https://localhost:7135/api/SanPhamx");
            setProducts(response.data);
            setMaSanPham(response.data[0].maSanPham)
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
    }

    const callApiGetProductImgs = async () => {

        try {
            const response = await axios.get("https://localhost:7135/api/SanPhamImgs");
            setImages(response.data)
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
    }

    // biến để truyền sản phẩm vào modal để sửa
    const [editProduct, setEditProduct] = useState(null)
    // open modal sửa sản phẩm
    const [isOpen, setIsOpen] = useState(false);
    const showEditModal = (product) => {
        setEditProduct(product)
        setIsOpen(true)
    }

    // hàm xóa sản phẩm
    const deleteProduct = (productid) => {
        console.log(productid)
        const isConfirmed = window.confirm("Bạn có chắc muốn xóa sản phẩm này không?");

        if (isConfirmed) {
            axios.delete(`https://localhost:7135/api/SanPhamx/${productid}`)
                .then(response => {
                    notify_success('xóa thành công.')
                    callApiGetProducts()
                    callApiGetProductImgs()
                })
                .catch(error => {
                    notify_error('xóa thất bại !')
                })
        } else {
            console.log("Người dùng đã hủy xóa.");
        }
    }

    const notify = (message) => toast.info(message, {
        type: "error"
    });

    return (
        <div className='product-container'>
            <div className="product-header">Products</div>
            <div className='body'>
                <div className='product-list'>
                    <button
                        className='create-new-product-btn'
                        onClick={() => clickCreateProduct()}
                    >New</button>
                    <div className='product-title-row'>
                        <div className='product-list-title product-list-title-left'>Product name</div>
                        <div className='product-list-title product-list-title-right'>Price</div>
                    </div>
                    <div className='product-list-columns'>
                        {
                            productList.map((item, index) => (
                                <div className='product-1-row'
                                    onClick={() => clickToDetail(item)}
                                    style={{
                                        backgroundColor:
                                            hoveredRowIndex === index
                                                ? "#C0C0C0" // Màu khi hover
                                                : index % 2 !== 0
                                                    ? "#D1E8FE" // Màu nền xen kẽ
                                                    : "#ffffff",
                                        transition: "background-color 0.3s", // Hiệu ứng mượt mà
                                    }}
                                    onMouseEnter={() => setHoveredRowIndex(index)}
                                    onMouseLeave={() => setHoveredRowIndex(null)}
                                >
                                    <div>{item.tenSanPham}</div>
                                    <div style={{ color: '#3E58CE' }}>{item.giaBan}</div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className='product-detail'>
                    {
                        productList.map((item, index) => {
                            if (item.maSanPham === maSanPham) {
                                return (
                                    <div key={index}
                                        style={{
                                            borderColor: '#3BBAF5',
                                            borderWidth: 2,
                                            borderStyle: 'solid',
                                            boxShadow: '8px 8px 15px rgba(0, 0, 0, 0.2), -8px -8px 15px rgba(255, 255, 255, 0.8)',
                                            backgroundColor: 'rgba(0, 0, 22, 0.9)',
                                            width: '80%',
                                            margin: 'auto',
                                            height: '95%',
                                            marginTop: 30,
                                            borderRadius: 20,
                                            paddingBottom: 20
                                        }}>
                                        {/*  */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                gap: 10,
                                                flexWrap: 'nowrap',
                                                justifyContent: 'center',
                                                width: '95%',
                                                overflowX: 'auto',
                                                margin: 'auto',
                                                marginTop: 20,
                                                marginLeft: 20,
                                                marginRight: 20,
                                                height: '50%',
                                                backgroundColor: '#fff'
                                            }}>
                                            <div>
                                                {item.img.length > 0 ? (
                                                    item.img.map((imgUrl, imgIndex) => (
                                                        <img key={imgIndex} src={`data:image/png;base64,${imgUrl}`} height="100%" width="100%"
                                                            style={{ objectFit: 'contain', border: '1px solid #ddd', borderRadius: 5 }}
                                                        />
                                                    ))
                                                ) : (
                                                    <p>No images available</p>
                                                )}
                                            </div>
                                        </div>
                                        {/*  */}
                                        <div className='product-name-detail-row'>
                                            <div className='product-name-detail'>{item.tenSanPham}</div>
                                        </div>
                                        <div className='product-detail-row'>
                                            <div className='product-detail-description'>{item.moTa}</div>
                                        </div>
                                        <div className='product-detail-row'>
                                            <div className='product-detail-value'
                                                style={{
                                                    backgroundColor: '#FFCC00',
                                                    padding: 10,
                                                    borderRadius: 10,
                                                    color: '#fff',
                                                    marginLeft: 600,
                                                    fontSize: 15
                                                }}
                                            >
                                                {item.nhomSanPham}
                                            </div>
                                        </div>
                                        <div className='product-detail-row'>
                                            <div
                                                className='product-detail-value'
                                                style={{
                                                    color: '#fff',
                                                    fontSize: 30,
                                                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                                    paddingLeft: 20,
                                                    paddingRight: 20,
                                                    borderRadius: 17
                                                }}
                                            >
                                                {item.giaBan} VND
                                            </div>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-around',
                                            marginTop: 30,
                                        }}>
                                            <button className='btn-delete' onClick={() => deleteProduct(item.maSanPham)}>Delete</button>
                                            <button className='btn-edit' onClick={() => showEditModal(item)}>Edit</button>
                                        </div>
                                    </div>
                                );
                            }
                            // if (maSanPham === '' && productList.length > 0) {
                            //     return (
                            //         <div key="default">
                            //             <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', width: 940, overflowX: 'auto', marginTop: 20 }}>
                            //                 {productList[0].img.length > 0 ? (
                            //                     productList[0].img.map((imgUrl, imgIndex) => (
                            //                         <img key={imgIndex} src={`data:image/png;base64,${imgUrl}`} height={200}
                            //                             style={{ objectFit: 'contain', border: '1px solid #ddd', borderRadius: 5 }}
                            //                         />
                            //                     ))
                            //                 ) : (
                            //                     <p>No images available</p>
                            //                 )}
                            //             </div>
                            //             <div className='product-name-detail-row'>
                            //                 <div className='product-name-detail-label'>Product Name : </div>
                            //                 <div className='product-name-detail'>{productList[0].tenSanPham}</div>
                            //             </div>
                            //             <div className='product-detail-row'>
                            //                 <div>Price : </div>
                            //                 <div className='product-detail-value'>{productList[0].giaBan}</div>
                            //             </div>
                            //             <div className='product-detail-row'>
                            //                 <div>Unit : </div>
                            //                 <div className='product-detail-value'>{productList[0].donViTinh}</div>
                            //             </div>
                            //             <div className='product-detail-row'>
                            //                 <div>Product Type : </div>
                            //                 <div className='product-detail-value'>{productList[0].nhomSanPham}</div>
                            //             </div>
                            //             <div className='product-detail-row'>
                            //                 <div>Description : </div>
                            //                 <div className='product-detail-description'>{productList[0].moTa}</div>
                            //             </div>
                            //         </div>
                            //     );
                            // }
                        })

                    }
                </div>
            </div>

            {loading && <Loading />} {/* Hiển thị Loading khi đang xử lý */}
            <ToastContainer theme="colored" />
            {isOpen && <FullScreenModal product={editProduct} setIsOpen={setIsOpen} callApiGetProducts={callApiGetProducts} callApiGetProductImgs={callApiGetProductImgs} />}
        </div >
    )
}

function Loading() {
    return (
        <div
            style={{
                width: '100%',
                height: '100vh',
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
                position: 'fixed',
                top: 0,
                right: 0,
            }}
        >
            <Spinner animation="grow" variant="primary" />

        </div>
    );
}



const notify_success = (message) => toast.info(message, {
    type: "success"
});

const notify_error = (message) => toast.info(message, {
    type: "error"
});

const FullScreenModal = ({ product, setIsOpen, callApiGetProducts, callApiGetProductImgs }) => {

    const productNameRef = useRef(null)
    const priceRef = useRef(null)
    const typeRef = useRef(null)
    const descriptionRef = useRef(null)
    const unitRef = useRef(null)

    const [formData, setFormData] = useState({
        maSanPham: "",
        tenSanPham: "",
        giaBan: "",
        donViTinh: "",
        moTa: "",
        nhomSanPham: ""
    });

    // Khi product thay đổi, cập nhật state
    useEffect(() => {
        if (product) {
            setFormData(product);
        }
    }, [product]);

    // Hàm cập nhật state khi nhập input
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const callApiSaveProduct = async () => {

        var requestBody = {
            maSanPham: product.maSanPham,
            tenSanPham: productNameRef.current.value,
            maVach: product.maVach,
            donViTinh: unitRef.current.value,
            nhomSanPham: typeRef.current.value,
            giaBan: priceRef.current.value,
            moTa: descriptionRef.current.value
        }

        axios.put(`https://localhost:7135/api/SanPhamx/${product.maSanPham}`, requestBody)
            .then(response => {
                notify_success('Chỉnh sửa sản phẩm thành công')
                setIsOpen(false)
                callApiGetProducts()
                callApiGetProductImgs()
            })
            .catch(error => {
                notify_error(error.message)
            })
    }

    return (
        <div
            className="flex items-center justify-center min-h-screen"
            style={{
                backgroundColor: "rgba(0,0,0,0.8)",
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <div
                style={{
                    width: "40%",
                    backgroundColor: "#fff",
                    display: "flex",
                    justifyContent: "space-around",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingBottom: 20
                }}
            >
                <button
                    style={{
                        width: 40,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: "90%",
                        color: "red",
                        marginTop: 10
                    }}
                    onClick={closeModal}
                >
                    <AiOutlineClose />
                </button>
                <h2 className="text-2xl mb-4">Chỉnh sửa sản phẩm</h2>

                <div style={{ marginRight: "460px", fontWeight: "bold" }}>
                    Product ID
                </div>
                <input
                    type="text"
                    name="maSanPham"
                    className="border p-2 mb-2 w-80"
                    style={{ width: "80%" }}
                    readOnly
                    value={formData.maSanPham}
                />

                <div style={{ marginRight: "440px", fontWeight: "bold" }}>
                    Product name
                </div>
                <input
                    type="text"
                    name="tenSanPham"
                    className="border p-2 mb-2 w-80"
                    style={{ width: "80%" }}
                    value={formData.tenSanPham}
                    onChange={handleChange}
                    ref={productNameRef}
                />

                <div style={{ marginRight: "500px", fontWeight: "bold" }}>
                    Price
                </div>
                <input
                    type="text"
                    name="giaBan"
                    className="border p-2 mb-2 w-80"
                    style={{ width: "80%" }}
                    value={formData.giaBan}
                    onChange={handleChange}
                    ref={priceRef}
                />

                <div style={{ marginRight: "500px", fontWeight: "bold" }}>
                    Unit
                </div>
                <input
                    type="text"
                    name="donViTinh"
                    className="border p-2 mb-4 w-80"
                    style={{ width: "80%" }}
                    value={formData.donViTinh}
                    onChange={handleChange}
                    ref={unitRef}
                />

                <div style={{ marginRight: "500px", fontWeight: "bold" }}>
                    Type
                </div>
                <input
                    type="text"
                    name="donViTinh"
                    className="border p-2 mb-4 w-80"
                    style={{ width: "80%" }}
                    value={formData.nhomSanPham}
                    onChange={handleChange}
                    ref={typeRef}
                />

                <div style={{ marginRight: "450px", fontWeight: "bold" }}>
                    Description
                </div>
                <input
                    type="text"
                    name="moTa"
                    className="border p-2 mb-4 w-80"
                    style={{ width: "80%" }}
                    value={formData.moTa}
                    onChange={handleChange}
                    ref={descriptionRef}
                />

                <button
                    style={{
                        borderWidth: 0,
                        width: 100,
                        height: 50,
                        backgroundColor: "#3C8DBC",
                        color: "white",
                        fontSize: 22,
                        marginLeft: "70%"
                    }}
                    onClick={() => callApiSaveProduct()}
                >
                    Save
                </button>
            </div>
        </div>
    );
};


export default Product