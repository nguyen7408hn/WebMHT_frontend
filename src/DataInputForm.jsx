import { useState, useEffect } from 'react';
import Textfield from '@atlaskit/textfield';
import { useNavigate } from 'react-router-dom';
import Button from "./Button.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

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
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (formData.noiDon.length >= 1) { // Khi người dùng nhập từ 1 ký tự trở lên
      axios.get(`${API_URL}/identity/ThuTuNoiDon/suggestions?query=${formData.noiDon}`)
        .then((response) => {
          console.log("Dữ liệu phản hồi từ API:", response.data);
          setSuggestions(response.data); // Cập nhật danh sách gợi ý
        })
        .catch((error) => {
          console.error('Lỗi khi lấy gợi ý:', error);
        });
    } else {
      setSuggestions([]); // Xoá gợi ý nếu chuỗi quá ngắn
    }
  }, [formData.noiDon, API_URL]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleView = () => {
    console.log("Giá trị tai hiện tại:", formData.tai);
    navigate(`/customers`, { state: { tai: formData.tai } });
  };

  // Hàm chọn gợi ý
  const handleSuggestionClick = (suggestion) => {
    setFormData({
      ...formData,
      noiDon: suggestion
    });
    setSuggestions([]); // Xoá gợi ý ngay khi chọn
  };

  const handleSubmit = async () => {
    let endpoint = '';

    switch (formData.tai) {
      case 'tai1h':
        endpoint = `${API_URL}/identity/Customers1H`;
        break;
      case 'tai7h':
        endpoint = `${API_URL}/identity/Customers7H`;
        break;
      case 'tai9h':
        endpoint = `${API_URL}/identity/Customers9H`;
        break;
      default:
        console.log("Vui lòng chọn một loại tài.");
        return;
    }

    try {
      await axios.post(endpoint, {
        id: formData.id,
        sdt: formData.soDT,
        sove: formData.soGhe,
        noidon: formData.noiDon,
        noidi: formData.noiDi
      });
  
      setSuccessMessage('Gửi dữ liệu thành công');
      setErrorMessage('');
      setMessageVisible(true);
    } catch (error) {
      console.error('Có lỗi xảy ra trong quá trình gửi dữ liệu:', error);
      setSuccessMessage('');
      setErrorMessage('Có lỗi xảy ra trong quá trình gửi dữ liệu');
      setMessageVisible(true);
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

      <div style={{ marginBottom: '10px', position: 'relative' }}>
        <Textfield
          name="noiDon"
          placeholder="Điền nơi đón"
          value={formData.noiDon}
          onChange={handleChange}
          onMouseEnter={handleMouseEnter}
          autoComplete="off"
        />
        {/* Danh sách gợi ý tùy chỉnh */}
        {suggestions.length > 0 && !suggestions.some(s => s.noidon === formData.noiDon) && ( // Chỉ hiển thị nếu không có gợi ý trùng
          <ul style={{ 
              border: '1px solid #ccc', 
              padding: '0', 
              margin: '0', 
              position: 'absolute', 
              zIndex: '1000', 
              backgroundColor: 'white', 
              listStyleType: 'none' // Đảm bảo không có dấu chấm
            }}>
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion.noidon)} style={{ padding: '8px', cursor: 'pointer' }}>
                {suggestion.noidon}
              </li>
            ))}
          </ul>
        )}
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
