import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReportOverView = () => {
    const [data, setData] = useState([]);

    // Gọi API khi component được mount
    useEffect(() => {
        axios.get('https://localhost:7135/api/BaoCaoSanXuats/tong-quan-san-pham')  
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error('Có lỗi xảy ra khi gọi API:', error);
            });
    }, []);

    // Xử lý dữ liệu để chuẩn bị cho biểu đồ
    const chartData = {
        labels: data.map(item => item.tenSanPham),  // Lấy tên sản phẩm làm nhãn
        datasets: [
            {
                label: 'Số lượng sản phẩm',
                data: data.map(item => item.soLuong),  // Lấy số lượng sản phẩm làm dữ liệu
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Màu nền cho cột
                borderColor: 'rgba(75, 192, 192, 1)', // Màu viền cho cột
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            <h2>Biểu đồ Sản phẩm</h2>
            <Bar data={chartData} options={{ responsive: true }} />
        </div>
    );
};

export default ReportOverView;
