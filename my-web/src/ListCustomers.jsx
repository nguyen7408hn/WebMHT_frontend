import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Button from "./Button";
import 'bootstrap/dist/css/bootstrap.min.css';

const ListCustomers = () => {
    const [tai, setTai] = useState("tai1h");
    const [customers, setCustomers] = useState([]);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchCustomers = async () => {
            let endpoint = "";

            switch (tai) {
                case "tai1h":
                    endpoint = "/identity/Customers1H";
                    break;
                case "tai7h":
                    endpoint = "/identity/Customers7H";
                    break;
                case "tai9h":
                    endpoint = "/identity/Customers9H";
                    break;
                default:
                    return;
            }

            try {
                const response = await fetch(endpoint);
                if (response.ok) {
                    const data = await response.json();
                    setCustomers(data);
                } else {
                    console.error("Lỗi khi lấy dữ liệu khách hàng");
                }
            } catch (error) {
                console.error("Lỗi:", error);
            }
        };

        fetchCustomers();
    }, [tai]);

    const handleChange = (e) => {
        setTai(e.target.value);
    };

    const handleGoToDataInputForm = () => {
        navigate('/'); 
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
                endpoint = `/identity/Customers1H/${id}`;
                break;
            case "tai7h":
                endpoint = `/identity/Customers7H/${id}`;
                break;
            case "tai9h":
                endpoint = `/identity/Customers9H/${id}`;
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
                console.error("Lỗi khi xoá khách hàng");
            }
        } catch (error) {
            console.error("Lỗi:", error);
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

    return (
        <div>
            <div style={{ marginBottom: '10px' }}>
                <Button 
                    onClick={handleGoToDataInputForm} 
                    style={{ marginBottom: '10px', padding: '10px 20px', fontSize: '16px' }}
                >
                    Nhập thêm khách
                </Button>
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
                <table className='table table-striped table-bordered'>
                    <thead>
                        <tr>
                            <th>STT</th> 
                            <th>Số điện thoại</th>
                            <th>Số vé</th>
                            <th>Nơi đón</th>
                            <th>Nơi đi</th>
                            <th>Sửa/Xoá</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer, index) => (
                            <tr key={customer.id}>
                                <td>{index + 1}</td> 
                                <td>{customer.sdt}</td>
                                <td>{customer.sove}</td>
                                <td>{customer.noidon}</td>
                                <td>{customer.noidi}</td>
                                <td>
                                    <button className = 'btn btn-info' onClick={() => updateCustomers(customer.id)}>Sửa</button>
                                    <button className='btn btn-danger'onClick={() => handleDelete(customer.id)}
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

export default ListCustomers;
