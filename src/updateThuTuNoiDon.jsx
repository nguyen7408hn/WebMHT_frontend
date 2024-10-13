import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Textfield from '@atlaskit/textfield';
import Button from "./Button";
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateThuTuNoiDon = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    noidon: '',
    thutu: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [messageVisible, setMessageVisible] = useState(true); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchThuTuNoiDon = async () => {
      try {
        const response = await fetch(`${API_URL}/identity/ThuTuNoiDon/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            noidon: data.noidon,
            thutu: data.thutu
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

    fetchThuTuNoiDon();
  }, [id, API_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}/identity/ThuTuNoiDon/${id}`, {
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
    navigate('/listthutunoidon', { state: { editedId: id } });
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
      <h2>Cập nhật nơi đón và thứ tự</h2>

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
          name="thutu"
          placeholder="Điền nơi đi"
          value={formData.thutu}
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

export default UpdateThuTuNoiDon;
