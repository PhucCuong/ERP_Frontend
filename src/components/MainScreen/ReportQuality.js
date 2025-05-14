import axios from "axios";
import { useState, useEffect } from "react";
const ReportQuality = () => {

    const [products, setProducts] = useState([])

    const [selectedDateStart, setSelectedDateStart] = useState('');
    const [selectedDateEnd, setSelectedDateEnd] = useState('');

    const callApiGetProduct = async () => {
        await axios.get('https://localhost:7135/api/SanPhamx')
            .then(response => setProducts(response.data))
            .catch(error => {
                console.error('Lỗi:', error);
            });
    }

    const [selectedValue, setSelectedValue] = useState('All');

    const callApiLocSanPham = async () => {
        const requestBody = {
            maSanPham: selectedValue,
            ngayBatDau: selectedDateStart,
            ngayKetThuc: selectedDateEnd
        }

        console.log(requestBody)
    }

    useEffect(() => {
        callApiGetProduct()
    }, [])

    

    const handleChangeProduct = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleChangeDateStart = (event) => {
        setSelectedDateStart(event.target.value);
    };

    const handleChangeDateEnd = (event) => {
        setSelectedDateEnd(event.target.value);
    };

    return (
        <div>
            <h2>Báo cáo chất lượng sản phẩm</h2>
            <div
                style={{ display: 'flex', width: '100%' , alignItems: 'center'}}
            >
                    <h5
                        style={{ width: '50%' , marginLeft: 40, color: '#3E58CE'}}
                    >Chọn loại sản phẩm:</h5>
                    <select id="select-option" value={selectedValue} onChange={handleChangeProduct}
                        style={{ width: '50%' }}
                    >
                        <option value="all">All</option>
                        {
                            products.map(item => (
                                <option value={item.maSanPham}>{item.tenSanPham}</option>
                            ))
                        }
                    </select>
                    <h5
                        style={{ width: '40%',  marginLeft: '20%', color: '#3E58CE'}}
                    >Thời gian:</h5>

                    <h6
                        style={{width: 300}}
                    >Từ ngày</h6>
                    <input
                        type="date"
                        value={selectedDateStart}
                        onChange={handleChangeDateStart}
                        style={{ width: '30%' }}
                    />

                    <h6
                        style={{width: 300 , marginLeft: 40}}
                    >Đến ngày</h6>
                    <input
                        type="date"
                        value={selectedDateEnd}
                        onChange={handleChangeDateEnd}
                        style={{ width: '30%' }}
                    />

                    <button
                        style={{marginLeft: 30, marginRight: 30, borderRadius: 10}}
                        onClick={callApiLocSanPham}
                    >Lọc</button>
            </div>
        </div>
    )
}

export default ReportQuality