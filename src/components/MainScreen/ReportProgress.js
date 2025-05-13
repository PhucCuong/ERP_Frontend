import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await axios.get('https://localhost:7135/api/BaoCaoSanXuats/tien-do-san-xuat');
                setReport(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu báo cáo:', error);
            }
        };

        fetchReport();
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
                    '#A9A9A9'
                ],
            },
        ],
    };

    return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <h2>Báo cáo tiến độ sản xuất</h2>

            <Pie data={pieData} />

            <ul style={{ listStyleType: 'none', paddingLeft: 0 , marginTop: 20}}>
                <li style={{marginTop: 10, fontSize: 20, color: '#009933'}}><strong>Tổng lệnh sản xuất: {report.tongLenhSanXuat} </strong></li>
                <li style={{marginTop: 10, fontSize: 20, color: '#FF6384'}}><strong>Chưa bắt đầu: {report.soLenhSanXuatChuaBatDau} </strong></li>
                <li style={{marginTop: 10, fontSize: 20, color: '#36A2EB'}}><strong>Hoàn thành: {report.soLenhSanXuatHoanThanh} </strong> </li>
                <li style={{marginTop: 10, fontSize: 20, color: '#FFCE56'}}><strong>Đang thực hiện: {report.soLenhSanXuatDangThucHien} </strong></li>
                <li style={{marginTop: 10, fontSize: 20, color: '#FF9F40'}}><strong>Tạm dừng: {report.soLenhSanXuatTamDung} </strong></li>
                <li style={{marginTop: 10, fontSize: 20, color: '#A9A9A9'}}><strong>Bị khóa: {report.soLenhSanXuatBiKhoa} </strong></li>
            </ul>
        </div>
    );
};

export default ReportProgress;
