import { useState, useEffect } from 'react';
import Textfield from '@atlaskit/textfield';
import { useNavigate } from 'react-router-dom';
import Button from "./Button.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';

function DataInputForm() {
  const [formData, setFormData] = useState({
    id: '',
    tai: 'tai1h',
    soDT: '',
    soGhe: '',
    noiDon: '',
    noiDi: ''
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [messageVisible, setMessageVisible] = useState(true); 

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    let endpoint = '';

    switch (formData.tai) {
      case 'tai1h':
        endpoint = '/identity/Customers1H';
        break;
      case 'tai7h':
        endpoint = '/identity/Customers7H';
        break;
      case 'tai9h':
        endpoint = '/identity/Customers9H';
        break;
      default:
        console.log("Vui lòng chọn một loại tài.");
        return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: formData.id,
          sdt: formData.soDT,
          sove: formData.soGhe,
          noidon: formData.noiDon,
          noidi: formData.noiDi
        })
      });

      if (response.ok) {
        setSuccessMessage('Gửi dữ liệu thành công');
        setErrorMessage('');
        setMessageVisible(true);
      } else {
        setSuccessMessage('');
        console.error('Có lỗi xảy ra trong quá trình gửi dữ liệu');
        const errorData = await response.json();
        console.error('Lỗi:', errorData);
        setErrorMessage('Có lỗi xảy ra trong quá trình gửi dữ liệu');
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
    if (formData.tai === 'tai1h') {
        navigate('/customers1H', { state: { tai: formData.tai } });
    } else if (formData.tai === 'tai7h') {
        navigate('/customers7H', { state: { tai: formData.tai } });
    } else if (formData.tai === 'tai9h') {
        navigate('/customers9H', { state: { tai: formData.tai } });
    }
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginBottom: '10px' }}>
        <label>Tài: </label>
        <select name="tai" value={formData.tai} onChange={handleChange}>
          <option value="tai1h">Tài 1h</option>
          <option value="tai7h">Tài 7h</option>
          <option value="tai9h">Tài 9h</option>
        </select>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <Textfield
          name="soDT"
          placeholder="Điền số điện thoại"
          value={formData.soDT}
          onChange={handleChange}
          onMouseEnter={handleMouseEnter}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <Textfield
          name="soGhe"
          placeholder="Điền số ghế"
          value={formData.soGhe}
          onChange={handleChange}
          onMouseEnter={handleMouseEnter}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <Textfield
          name="noiDon"
          placeholder="Điền nơi đón"
          value={formData.noiDon}
          onChange={handleChange}
          onMouseEnter={handleMouseEnter}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <Textfield
          name="noiDi"
          placeholder="Điền nơi đi"
          value={formData.noiDi}
          onChange={handleChange}
          onMouseEnter={handleMouseEnter}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <Button onClick={handleSubmit}>Gửi</Button>
        <Button onClick={handleView}>Xem</Button>
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
}

export default DataInputForm;
