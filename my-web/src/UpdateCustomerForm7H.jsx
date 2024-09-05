import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Textfield from '@atlaskit/textfield';
import Button from "./Button";
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateCustomerForm7H = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    sdt: '',
    sove: '',
    noidon: '',
    noidi: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [messageVisible, setMessageVisible] = useState(true); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`/identity/Customers7H/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            sdt: data.sdt,
            sove: data.sove,
            noidon: data.noidon,
            noidi: data.noidi
          });
        } else {
          console.error("Lỗi khi lấy dữ liệu khách hàng");
        }
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/identity/Customers7H/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccessMessage('Cập nhật dữ liệu thành công');
        setErrorMessage('');
        setMessageVisible(true);
      } else {
        setSuccessMessage('');
        console.error('Có lỗi xảy ra trong quá trình cập nhật dữ liệu');
        const errorData = await response.json();
        console.error('Lỗi:', errorData);
        setErrorMessage('Có lỗi xảy ra trong quá trình cập nhật dữ liệu');
        setMessageVisible(true);
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu:', error);
      setSuccessMessage('');
      setErrorMessage('Lỗi khi gửi yêu cầu');
      setMessageVisible(true);
    }
  };

  const handleView = () => {
    navigate('/customers');
  };

  useEffect(() => {
    if (messageVisible) {
      const timer = setTimeout(() => {
        setMessageVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [messageVisible]);

  const handleMouseEnter = () => {
    setMessageVisible(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Cập nhật thông tin khách Tài 7H</h2>
      
      <div style={{ marginBottom: '10px' }}>
        <Textfield
          name="sdt"
          placeholder="Điền số điện thoại"
          value={formData.sdt}
          onChange={handleChange}
          onMouseEnter={handleMouseEnter}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <Textfield
          name="sove"
          placeholder="Điền số ghế"
          value={formData.sove}
          onChange={handleChange}
          onMouseEnter={handleMouseEnter}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <Textfield
          name="noidon"
          placeholder="Điền nơi đón"
          value={formData.noidon}
          onChange={handleChange}
          onMouseEnter={handleMouseEnter}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <Textfield
          name="noidi"
          placeholder="Điền nơi đi"
          value={formData.noidi}
          onChange={handleChange}
          onMouseEnter={handleMouseEnter}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <Button onClick={handleSubmit}>Cập nhật</Button>
        <Button onClick={handleView}>Xem danh sách</Button>
      </div>

      {successMessage && messageVisible && (
        <div style={{ color: 'green', marginTop: '10px' }}>
          {successMessage}
        </div>
      )}
      {errorMessage && messageVisible && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default UpdateCustomerForm7H;
