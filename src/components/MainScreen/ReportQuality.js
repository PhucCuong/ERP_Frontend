import axios from "axios";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';

import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);


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


    // biến lưu trữ api thống kê
    const [statistical, setStatistical] = useState({})
    const callApiGetAllProductQuality = async () => {
        var requestBody = {
            maSanPham: "All"
        }
        try {
            const response = await axios.post('https://localhost:7135/api/BaoCaoSanXuats/filter-chat-luong-san-pham', requestBody)
            setStatistical(response.data)
        } catch (ex) {
            notify_error('Lấy dữ liệu từ server thất bại : ', ex.message)
        }
    }

    const [selectedValue, setSelectedValue] = useState('All');

    useEffect(() => {
        callApiGetProduct()
        callApiGetAllProductQuality()
    }, [])


    const pieChartData = {
        labels: ['Chờ duyệt', 'Đạt yêu cầu', 'Không đạt'],
        datasets: [
            {
                label: 'Số lượng',
                data: [
                    statistical.sanPhamChoDuyet || 0,
                    statistical.sanPhamDatYeuCau || 0,
                    statistical.sanPhamKhongDatYeuCau || 0
                ],
                backgroundColor: ['#FFBB28', '#00C49F', '#CC0000'],
                borderColor: ['#ffffff', '#ffffff', '#ffffff'],
                borderWidth: 1
            }
        ]
    };


    const callApiLocSanPham = async () => {


        if (selectedDateStart !== '' && selectedDateEnd === '') {
            notify_error('Vui lòng chọn mốc thời gian kết thúc!')
            return
        }

        if (selectedDateEnd !== '' && selectedDateStart === '') {
            notify_error('Vui lòng chọn mốc thời gian bắt đầu!')
            return
        }

        if (selectedDateEnd === '' && selectedDateStart === '') {
            const requestBody = {
                maSanPham: selectedValue
            }
            try {
                const response = await axios.post('https://localhost:7135/api/BaoCaoSanXuats/filter-chat-luong-san-pham', requestBody)
                setStatistical(response.data)
            } catch (ex) {
                notify_error('Lấy dữ liệu từ server thất bại : ', ex.message)
            }

        }

        if (selectedDateEnd !== '' && selectedDateStart !== '') {
            const requestBody = {
                maSanPham: selectedValue,
                ngayBatDau: selectedDateStart,
                ngayKetThuc: selectedDateEnd
            }

            try {
                const response = await axios.post('https://localhost:7135/api/BaoCaoSanXuats/filter-chat-luong-san-pham', requestBody)
                setStatistical(response.data)
            } catch (ex) {
                notify_error('Lấy dữ liệu từ server thất bại : ', ex.message)
            }
        }
    }


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
                style={{ display: 'flex', width: '100%', alignItems: 'center' }}
            >
                <h5
                    style={{ width: '50%', marginLeft: 40, color: '#3E58CE' }}
                >Chọn loại sản phẩm:</h5>
                <select id="select-option" value={selectedValue} onChange={handleChangeProduct}
                    style={{ width: '50%' }}
                >
                    <option value="All">All</option>
                    {
                        products.map(item => (
                            <option value={item.maSanPham}>{item.tenSanPham}</option>
                        ))
                    }
                </select>
                <h5
                    style={{ width: '40%', marginLeft: '20%', color: '#3E58CE' }}
                >Thời gian:</h5>

                <h6
                    style={{ width: 300 }}
                >Từ ngày</h6>
                <input
                    type="date"
                    value={selectedDateStart}
                    onChange={handleChangeDateStart}
                    style={{ width: '30%' }}
                />

                <h6
                    style={{ width: 300, marginLeft: 40 }}
                >Đến ngày</h6>
                <input
                    type="date"
                    value={selectedDateEnd}
                    onChange={handleChangeDateEnd}
                    style={{ width: '30%' }}
                />

                <button
                    style={{ marginLeft: 30, marginRight: 30, borderRadius: 10 }}
                    onClick={callApiLocSanPham}
                >Lọc</button>
            </div>

            <div style={{ width: '40%', margin: '80px auto' }}>
                <Pie data={pieChartData} />
                <h4 style={{ textAlign: 'center' , marginTop: 30}}>Biểu đồ chất lượng sản phẩm</h4>
            </div>

            <ToastContainer theme="colored" />
        </div>
    )
}

const notify_success = (message) => toast.info(message, { type: "success" });
const notify_error = (message) => toast.info(message, { type: "error" });

export default ReportQuality