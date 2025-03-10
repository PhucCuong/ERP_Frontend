import Spinner from 'react-bootstrap/Spinner';
import { useState, useEffect } from 'react';
const Workcenters = () => {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true)
        setInterval(() => {
            setLoading(false)
        }, 300);
    }, [])
    return (
        <div>
            this is workcenters
            {loading && <Loading />} {/* Hiển thị Loading khi đang xử lý */}
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
export default Workcenters