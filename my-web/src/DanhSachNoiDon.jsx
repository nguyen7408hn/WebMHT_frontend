import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Button from "./Button";
import 'bootstrap/dist/css/bootstrap.min.css';

const DanhSachNoiDon = () => {
    const [listnoidon, setNoidon] = useState([]);
    const navigate = useNavigate(); 
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchNoidon = async () => {
            let endpoint = `${API_URL}/identity/ThuTuNoiDon`;

            try {
                const response = await fetch(endpoint);
                if (response.ok) {
                    const data = await response.json();
                    setNoidon(data);
                } else {
                    console.error("Lỗi khi lấy dữ liệu nơi đón");
                }
            } catch (error) {
                console.error("Lỗi:", error);
            }
        };

        fetchNoidon();
    });

    const handleGoToNhapThuTuNoiDon = () => {
        navigate('/nhapnoidon'); 
    };

    const handleGoToListCustomers = () => {
        navigate('/customers'); 
    };

    function updateNoidon(id) {
        let updatePath = `/updateThuTuNoiDon/${id}`;
        navigate(updatePath);
    }

    const handleDelete = async (id) => {
        let endpoint = `${API_URL}/identity/ThuTuNoiDon/${id}`;
        
        try {
            const response = await fetch(endpoint, {
                method: 'DELETE'
            });

            if (response.ok) {
                setNoidon(listnoidon.filter(thutu => thutu.id !== id));
            } else {
                console.error("Lỗi khi xoá thứ tự");
            }
        } catch (error) {
            console.error("Lỗi:", error);
        }
    };

    
    return (
        <div>
            <div style={{ marginBottom: '10px', display: 'flex', gap: '50px' }}>
                <Button 
                    onClick={handleGoToNhapThuTuNoiDon} 
                    style={{ marginBottom: '10px', padding: '10px 20px', fontSize: '16px' }}
                >
                    Nhập thêm thứ tự
                </Button>
                <Button 
                    onClick={handleGoToListCustomers} 
                    style={{ marginBottom: '10px', padding: '10px 20px', fontSize: '16px' }}
                >
                    Xem danh sách khách
                </Button>
            </div>

            <div className='container'>
                <h2 className='text-center'>Danh sách thứ tự nơi đón</h2>
                <table className='table table-striped table-bordered'>
                    <thead>
                        <tr>
                            <th>STT</th> 
                            <th>Nơi đón</th>
                            <th>Số thứ tự</th>
                            <th>Sửa/Xoá</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listnoidon
                            .slice() // Tạo một bản sao của mảng để không thay đổi mảng gốc
                            .sort((a, b) => a.thutu - b.thutu) // Sắp xếp theo thutu
                            .map((thutu) => (
                                <tr key={thutu.id}>
                                    <td>{thutu.thutu}</td> {/* STT hiển thị giá trị thutu */}
                                    <td>{thutu.noidon}</td>
                                    <td>{thutu.thutu}</td>  {/* Số thứ tự từ dữ liệu */}
                                    <td>
                                        <button className = 'btn btn-info' onClick={() => updateNoidon(thutu.id)}>Sửa</button>
                                        <button className='btn btn-danger'onClick={() => handleDelete(thutu.id)}
                                                style={{ backgroundColor: 'red', color: 'white', marginLeft: '10px' }}>Xoá</button>
                                    </td>
                                </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DanhSachNoiDon;