import { useState, useEffect } from 'react';
import Textfield from '@atlaskit/textfield';
import { useNavigate } from 'react-router-dom';
import Button from "./Button.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function DataInputForm() {
  const [formData, setFormData] = useState({
    id: '',
    tai: 'tai1h', // Giữ nguyên giá trị mặc định
    soDT: '',
    soGhe: '',
    noiDon: '',
    noiDi: ''
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [messageVisible, setMessageVisible] = useState(true); 
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false); 

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (formData.noiDon.length >= 1) {
      const queryParam = formData.noiDon;

      // Gửi yêu cầu API cho cả 'd' và 'đ'
      const promises = [
        axios.get(`${API_URL}/identity/ThuTuNoiDon/suggestions?query=${queryParam}`),
        axios.get(`${API_URL}/identity/ThuTuNoiDon/suggestions?query=${queryParam.replace(/d/g, 'đ')}`)
      ];

      Promise.all(promises)
        .then((responses) => {
          const allSuggestions = [...responses[0].data, ...responses[1].data];
          const uniqueSuggestions = Array.from(new Set(allSuggestions.map(s => s.noidon)))
            .map(id => allSuggestions.find(s => s.noidon === id));

          setSuggestions(uniqueSuggestions);
          setShowSuggestions(true);
        })
        .catch((error) => {
          console.error('Lỗi khi lấy gợi ý:', error);
        });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [formData.noiDon, API_URL]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData({
      ...formData,
      noiDon: suggestion
    });
    setSuggestions([]);
    setShowSuggestions(false);
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

      // Reset form data nhưng giữ lại tài
      setFormData((prevData) => ({
        ...prevData,
        id: '',
        soDT: '',
        soGhe: '',
        noiDon: '',
        noiDi: ''
      }));
      
      setSuggestions([]);
      setShowSuggestions(false);
    } catch (error) {
      console.error('Có lỗi xảy ra trong quá trình gửi dữ liệu:', error);
      setSuccessMessage('');
      setErrorMessage('Có lỗi xảy ra trong quá trình gửi dữ liệu');
      setMessageVisible(true);
    }
  };

  const handleView = () => {
    console.log("Giá trị tai hiện tại:", formData.tai);
    navigate(`/customers`, { state: { tai: formData.tai } });
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

  const handleFocusNoiDon = () => {
    if (formData.noiDon.length >= 1) {
      setShowSuggestions(true);
    }
  };

  const handleFocusOther = () => {
    setShowSuggestions(false); // Ẩn gợi ý khi focus vào ô khác
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
          onFocus={handleFocusOther} // Thêm sự kiện focus
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <Textfield
          name="soGhe"
          placeholder="Điền số ghế"
          value={formData.soGhe}
          onChange={handleChange}
          onMouseEnter={handleMouseEnter}
          onFocus={handleFocusOther} // Thêm sự kiện focus
        />
      </div>

      <div style={{ marginBottom: '10px', position: 'relative' }}>
        <Textfield
          name="noiDon"
          placeholder="Điền nơi đón"
          value={formData.noiDon}
          onChange={handleChange}
          onMouseEnter={handleMouseEnter}
          onFocus={handleFocusNoiDon} // Thêm sự kiện focus
          autoComplete="off"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul style={{ 
              border: '1px solid #ccc', 
              padding: '0', 
              margin: '0', 
              position: 'absolute', 
              zIndex: '1000', 
              backgroundColor: 'white', 
              listStyleType: 'none'
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
          onFocus={handleFocusOther} // Thêm sự kiện focus
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
