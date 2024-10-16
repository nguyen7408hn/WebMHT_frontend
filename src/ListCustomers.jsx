import { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import Button from "./Button";
import 'bootstrap/dist/css/bootstrap.min.css';

const ListCustomers = () => {
    const location = useLocation();
    const [tai, setTai] = useState(location.state?.tai || "tai1h");
    const [customers, setCustomers] = useState([]);
    const [noidonOrder, setNoidonOrder] = useState([]);
    const [maxId, setMaxId] = useState(null);
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;
    useEffect(() => {
        if (location.state?.tai) {
          setTai(location.state.tai); // Cập nhật giá trị `tai` dựa trên chuyển hướng
        }
      }, [location.state]);

    useEffect(() => {
        // Fetch dữ liệu thứ tự nơi đón
        const fetchNoidonOrder = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}/identity/ThuTuNoiDon`, {
                    method: 'GET'
                });
                if (response.ok) {
                    const data = await response.json();
                    setNoidonOrder(data);
                } else {
                    throw new Error("Lỗi khi lấy dữ liệu thứ tự nơi đón");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNoidonOrder();
    }, [API_URL]);

    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true);
            setError(null);
            let endpoint = "";
            switch (tai) {
                case "tai1h":
                    endpoint = `${API_URL}/identity/Customers1H`;
                    break;
                case "tai7h":
                    endpoint = `${API_URL}/identity/Customers7H`;
                    break;
                case "tai9h":
                    endpoint = `${API_URL}/identity/Customers9H`;
                    break;
                default:
                    return;
            }
    
            try {
                const response = await fetch(endpoint, {
                    method: 'GET'
                });
                if (response.ok) {
                    const data = await response.json();
                    setCustomers(data);
                    const maxCustomerId = Math.max(...data.map(customer => customer.id), 0);
                    setMaxId(maxCustomerId);
                } else {
                    throw new Error("Lỗi khi lấy dữ liệu khách hàng");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchCustomers();
    }, [tai, API_URL]);

    const handleChange = (e) => {
        setTai(e.target.value);
    };

    const handleGoToDataInputForm = () => {
        navigate('/');
    };

    const sapxep = () => {
        const orderMap = noidonOrder.reduce((map, item) => {
            map[item.noidon] = item.thutu;
            return map;
        }, {});

        const sortedCustomers = [...customers].sort((a, b) => {
            const orderA = orderMap[a.noidon] || Infinity;
            const orderB = orderMap[b.noidon] || Infinity;
            return orderA - orderB;
        });

        setCustomers(sortedCustomers);
    };

    const danhsachthutunoidon = () => {
        navigate('/listthutunoidon');
    }

    const calculateTotalTickets = () => {
        return customers.reduce((total, customer) => total + (customer.sove || 0), 0);
    };

    const calculateTicketsStartingWithVe = () => {
        return customers.reduce((total, customer) => {
            // Check if sdt starts with "Về"
            if (customer.sdt.startsWith("Về")) {
                return total + (customer.sove || 0); // Include if condition is met
            }
            return total; // Return current total if condition is not met
        }, 0);
    };

    const calculateVeDi = () => {
        const totalTickets = calculateTotalTickets();
        const totalVeVe = calculateTicketsStartingWithVe();
        return totalTickets - totalVeVe; // Vé đi = Tổng vé - Vé về
    };

    function updateCustomers(id) {
        let updatePath = "";
        switch (tai) {
            case "tai1h":
                updatePath = `/updateCustomer1h/${id}`;
                break;
            case "tai7h":
                updatePath = `/updateCustomer7h/${id}`;
                break;
            case "tai9h":
                updatePath = `/updateCustomer9h/${id}`;
                break;
            default:
                break;
        }
        navigate(updatePath);
    }

    const handleDelete = async (id) => {
        let endpoint = "";
        switch (tai) {
            case "tai1h":
                endpoint = `${API_URL}/identity/Customers1H/${id}`;
                break;
            case "tai7h":
                endpoint = `${API_URL}/identity/Customers7H/${id}`;
                break;
            case "tai9h":
                endpoint = `${API_URL}/identity/Customers9H/${id}`;
                break;
            default:
                return;
        }

        try {
            const response = await fetch(endpoint, {
                method: 'DELETE'
            });

            if (response.ok) {
                setCustomers(customers.filter(customer => customer.id !== id));
            } else {
                throw new Error("Lỗi khi xoá khách hàng");
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeleteAll = async () => {
        let endpoint = "";
        switch (tai) {
            case "tai1h":
                endpoint = `${API_URL}/identity/Customers1H/customers`;
                break;
            case "tai7h":
                endpoint = `${API_URL}/identity/Customers7H/customers`;
                break;
            case "tai9h":
                endpoint = `${API_URL}/identity/Customers9H/customers`;
                break;
            default:
                return;
        }
    
        try {
            const response = await fetch(endpoint, {
                method: 'DELETE'
            });
    
            if (response.ok) {
                setCustomers([]); // Xóa danh sách khách hàng trong state
            } else {
                throw new Error("Lỗi khi xoá tất cả khách hàng");
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const getTaiLabel = () => {
        switch (tai) {
            case "tai1h":
                return "Tài 1h";
            case "tai7h":
                return "Tài 7h";
            case "tai9h":
                return "Tài 9h";
            default:
                return "";
        }
    };


    /*
    const handlePrint = () => {
        // Tạo một cửa sổ mới
        const printWindow = window.open('', '', 'height=600,width=800');
    
        // Tạo nội dung HTML cho cửa sổ in
        printWindow.document.write('<html><head><title>Print</title>');
        printWindow.document.write('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">');
        printWindow.document.write('</head><body >');
        
        // Sao chép nội dung bảng vào cửa sổ in
        const tableHTML = document.querySelector('.container').innerHTML;
        printWindow.document.write(tableHTML);
        
        printWindow.document.write('</body></html>');
        
        // Đảm bảo nội dung được tải trước khi gọi print
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };
    */
    
    const handlePrint = () => {
        const orderMap = noidonOrder.reduce((map, item) => {
            map[item.noidon] = item.thutu;
            return map;
        }, {});
    
        const sortedCustomers = [...customers].sort((a, b) => {
            const orderA = orderMap[a.noidon] || Infinity;
            const orderB = orderMap[b.noidon] || Infinity;
            return orderA - orderB;
        });

        const veDi = calculateVeDi();
    
        navigate('/print', {
            state: {
                customers: sortedCustomers, // Truyền danh sách đã sắp xếp
                taiLabel: getTaiLabel(),
                veDi: veDi // Truyền vé đi
            }
        });
    };

    return (
        <div>
            <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', gap: '100px', marginBottom: '10px' }}>
                    <Button
                        onClick={handleGoToDataInputForm}
                        style={{ marginBottom: '10px', padding: '10px 20px', fontSize: '16px' }}
                    >
                        Nhập thêm khách
                    </Button>
                    <Button
                        onClick={handlePrint}
                        style={{ marginBottom: '10px', padding: '10px 20px', fontSize: '16px' }}
                    >
                        In
                    </Button>
                    <Button
                        onClick={sapxep}
                        style={{ marginBottom: '10px', padding: '10px 20px', fontSize: '16px' }}
                    >
                        Sắp xếp
                    </Button>
                    <Button
                        onClick={danhsachthutunoidon}
                        style={{ marginBottom: '10px', padding: '10px 20px', fontSize: '16px' }}
                    >
                        Danh Sách Nơi Đón
                    </Button>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Tài: </label>
                    <select value={tai} onChange={handleChange}>
                        <option value="tai1h">Tài 1h</option>
                        <option value="tai7h">Tài 7h</option>
                        <option value="tai9h">Tài 9h</option>
                    </select>
                </div>
            </div>

            <div className='container'>
                <h2 className='text-center'>Danh sách khách đặt vé đi. {getTaiLabel()}</h2>
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <h4 className='text-center' style={{ color: 'green' }}>
                    Số khách đi: {calculateVeDi()} Và Số khách về: {calculateTicketsStartingWithVe()}
                </h4>
                
                <table className='table table-striped table-bordered'>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Số điện thoại</th>
                            <th>Số vé</th>
                            <th>Nơi đón</th>
                            <th>Ghi chú</th>
                            <th>Nơi đi</th>
                            <th>Sửa/Xoá</th>
                            <th>Lưu ý</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer, index) => (
                            <tr key={customer.id}>
                                <td>{index + 1}</td>
                                <td>{customer.sdt}</td>
                                <td>{customer.sove}</td>
                                <td>{customer.noidon}</td>
                                <td>{customer.ghichu}</td>
                                <td>{customer.noidi}</td>
                                <td>
                                    <button className='btn btn-info' onClick={() => updateCustomers(customer.id)}>Sửa</button>
                                    <button className='btn btn-danger' onClick={() => handleDelete(customer.id)}
                                            style={{ backgroundColor: 'red', color: 'white', marginLeft: '10px' }}>Xoá</button>
                                </td>
                                <td>
                                    {customer.id === maxId ? (
                                        <span style={{ color: 'green', marginLeft: '10px' }}>
                                            Vừa mới nhập
                                        </span>
                                    ) : null}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Nút Xoá hết */}
                <button className='btn btn-danger'
                    onClick={handleDeleteAll} 
                    style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', backgroundColor: 'red', color: 'white' }}
                >
                    Xoá hết
                </button>
            </div>
        </div>
    );
};

export default ListCustomers;
