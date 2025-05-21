import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ReportProgress = () => {
    const [report, setReport] = useState(null);

    const [products, setProducts] = useState([])

    const [selectedDateStart, setSelectedDateStart] = useState('');
    const [selectedDateEnd, setSelectedDateEnd] = useState('');

    const [statistical, setStatistical] = useState({})

    const [selectedValue, setSelectedValue] = useState('All');

    const callApiGetProduct = async () => {
        await axios.get('https://localhost:7135/api/SanPhamx')
            .then(response => setProducts(response.data))
            .catch(error => {
                console.error('Lỗi:', error);
            });
    }

    useEffect(() => {
        const fetchReport = async () => {
            const requestBody = {
                maSanPham: "All",
            }
            try {
                const response = await axios.post('https://localhost:7135/api/BaoCaoSanXuats/tien-do-san-xuat', requestBody);
                setReport(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu báo cáo:', error);
            }
        };

        fetchReport();

        callApiGetProduct()
    }, []);

    if (!report) return <div>Đang tải dữ liệu...</div>;

    const pieData = {
        labels: [
            'Chưa bắt đầu',
            'Hoàn thành',
            'Đang thực hiện',
            'Tạm dừng',
            'Bị khóa',
        ],
        datasets: [
            {
                data: [
                    report.soLenhSanXuatChuaBatDau,
                    report.soLenhSanXuatHoanThanh,
                    report.soLenhSanXuatDangThucHien,
                    report.soLenhSanXuatTamDung,
                    report.soLenhSanXuatBiKhoa,
                ],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#FF9F40',
                    '#CC0000'
                ],
            },
        ],
    };


    const handleChangeProduct = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleChangeDateStart = (event) => {
        setSelectedDateStart(event.target.value);
    };

    const handleChangeDateEnd = (event) => {
        setSelectedDateEnd(event.target.value);
    };


    /////////////////////////////////////////////////

    const callApiLocTienDo = async () => {


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
                const response = await axios.post('https://localhost:7135/api/BaoCaoSanXuats/tien-do-san-xuat', requestBody)
                setReport(response.data)
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
                const response = await axios.post('https://localhost:7135/api/BaoCaoSanXuats/tien-do-san-xuat', requestBody)
                setReport(response.data)
            } catch (ex) {
                notify_error('Lấy dữ liệu từ server thất bại : ', ex.message)
            }
        }
    }

    return (
        <div style={{ margin: '0 auto' }}>
            <h2>Báo cáo tiến độ sản xuất</h2>

            <div
                style={{ display: 'flex', width: '100%', alignItems: 'center'}}
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
                    onClick={callApiLocTienDo}
                >Lọc</button>
            </div>

            <div
                style={{maxWidth: 600, margin: '10px auto'}}
            >
                <Pie data={pieData} />

                <ul style={{ listStyleType: 'none', paddingLeft: 0, marginTop: 20 }}>
                    <li style={{ marginTop: 10, fontSize: 20, color: '#009933' }}><strong>Tổng lệnh sản xuất: {report.tongLenhSanXuat} </strong></li>
                    <li style={{ marginTop: 10, fontSize: 20, color: '#FF6384' }}><strong>Chưa bắt đầu: {report.soLenhSanXuatChuaBatDau} </strong></li>
                    <li style={{ marginTop: 10, fontSize: 20, color: '#36A2EB' }}><strong>Hoàn thành: {report.soLenhSanXuatHoanThanh} </strong> </li>
                    <li style={{ marginTop: 10, fontSize: 20, color: '#FFCE56' }}><strong>Đang thực hiện: {report.soLenhSanXuatDangThucHien} </strong></li>
                    <li style={{ marginTop: 10, fontSize: 20, color: '#FF9F40' }}><strong>Tạm dừng: {report.soLenhSanXuatTamDung} </strong></li>
                    <li style={{ marginTop: 10, fontSize: 20, color: '#CC0000' }}><strong>Bị khóa: {report.soLenhSanXuatBiKhoa} </strong></li>
                </ul>
            </div>

            <ToastContainer theme="colored" />
        </div>
    );
};

const notify_success = (message) => toast.info(message, { type: "success" });
const notify_error = (message) => toast.info(message, { type: "error" });

export default ReportProgress;
