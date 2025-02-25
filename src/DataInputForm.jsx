import { useState, useEffect, useMemo, useRef } from 'react';
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
    noiDi: '',
    ghiChu: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [messageVisible, setMessageVisible] = useState(true); 
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false); 
  const [submittedData, setSubmittedData] = useState(null);
  const [lastNoiDon, setLastNoiDon] = useState('');
  const [suggestionsNoiDi, setSuggestionsNoiDi] = useState([]);
  const [showSuggestionsNoiDi, setShowSuggestionsNoiDi] = useState(false);
  const [customerType, setCustomerType] = useState('Khách đi');
  const debounceTimeout = useRef(null);


  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const goiyNoiDi = useMemo(() => [
    "Miền Đông",
    "Nhi Đồng 1",
    "Từ Dũ",
    "Ung Bướu",
    "Phú Giáo",
    "Cổng Xanh",
    "Chợ Rẫy",
    "Ung Bướu 2",
    "Bình Dân",
    "Phạm Ngọc Thạch",
    "Tai Mũi Họng",
    "Y Dược",
    "Nhi Đồng 2",
    "Xe Thanh Thuỷ",
    "Xe Hùng Cường",
    "Cây Khô",
    "Nhật Tảo",
    "BV Gút",
    "175",
    "Chỉnh Hình",
    "Ngã 4 Bình Phước",
    "Phú Nhuận",
    "Sân Bay",
    "Mắt",
    "Nhiệt Đới",
    "Hoà Hảo",
    "Tim",
    "Da Liễu",
    "Thần kinh QT",
    "Phụ sản QT",
    "Mắt Việt Nga",
    "Mắt Sài Gòn",
    "Cổng chào BD",
  ], []);

  useEffect(() => {
    if (formData.noiDon.length < 1 || formData.noiDon === lastNoiDon) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      const queryParam = formData.noiDon;

      const fetchData = async () => {
        try {
          const responses = await Promise.all([
            axios.get(`${API_URL}/identity/ThuTuNoiDon/suggestions?query=${queryParam}`),
            axios.get(`${API_URL}/identity/ThuTuNoiDon/suggestions?query=${queryParam.replace(/d/g, 'đ').replace(/D/g, 'Đ')}`)
          ]);

          const allSuggestions = [...responses[0].data, ...responses[1].data];
          const uniqueSuggestions = Array.from(new Set(allSuggestions.map(s => s.noidon)))
            .map(id => allSuggestions.find(s => s.noidon === id));

          setSuggestions(uniqueSuggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Lỗi khi lấy gợi ý:', error);
        }
      };

      fetchData();
      setLastNoiDon(formData.noiDon);
    }, 300); // Đợi 300ms sau khi nhập mới gọi API

    return () => clearTimeout(debounceTimeout.current);
  }, [formData.noiDon, API_URL, lastNoiDon]);

  const formatPhoneNumber = (value) => {
    return value.replace(/\D/g, '') // Xóa ký tự không phải số
                .replace(/(\d{4})(\d{3})?(\d{3})?/, (match, p1, p2, p3) => {
                  if (p2 && p3) return `${p1} ${p2} ${p3}`;
                  if (p2) return `${p1} ${p2}`;
                  return p1;
                });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'soDT') {
      setFormData(prevData => ({
        ...prevData,
        [name]: formatPhoneNumber(value)
      }));
      return;
    }

    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    if (name === 'noiDon' && value.length >= 1) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }

    if (name === 'noiDi') {
      if (value.length >= 1) {
        const matches = goiyNoiDi.filter(suggestion => 
          suggestion.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestionsNoiDi(matches);
        setShowSuggestionsNoiDi(matches.length > 0);
      } else {
        setSuggestionsNoiDi([]);
        setShowSuggestionsNoiDi(false);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData(prevData => ({
      ...prevData,
      noiDon: suggestion
    }));
    setLastNoiDon(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSuggestionClickNoiDi = (selectedNoiDi) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      noiDi: selectedNoiDi
    }));
    setSuggestionsNoiDi([]);
    setShowSuggestionsNoiDi(false);
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

      // Loại bỏ khoảng trắng trước khi gửi và thêm chữ "Về" nếu là "Khách về"
      const formattedData = {
      ...formData,
      sdt: customerType === 'Khách về' ? `Về ${formData.soDT.replace(/\s+/g, '')}` : formData.soDT.replace(/\s+/g, ''),
      };

      console.log("Dữ liệu gửi đi:", {
        id: formattedData.id,
        sdt: formattedData.sdt,
        sove: formattedData.soGhe,
        noidon: formattedData.noiDon,
        noidi: formattedData.noiDi,
        ghichu: formattedData.ghiChu,
      });

      await axios.post(endpoint, {
        id: formattedData.id,
        sdt: formattedData.sdt, // Sử dụng trường đã loại bỏ khoảng cách
        sove: formattedData.soGhe,
        noidon: formattedData.noiDon,
        noidi: formattedData.noiDi,
        ghichu: formattedData.ghiChu
      });

      setSuccessMessage('Gửi dữ liệu thành công');
      setErrorMessage('');
      setMessageVisible(true);
      setSubmittedData(formData);

      setFormData((prevData) => ({
        ...prevData,
        id: '',
        soDT: '',
        soGhe: '',
        noiDon: '',
        noiDi: '',
        ghiChu: ''
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
    setShowSuggestions(false);
    setShowSuggestionsNoiDi(false); // Ẩn gợi ý nơi đi khi focus vào ô khác
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

      <div style={{ marginBottom: '10px', marginLeft: '0px' }}>
      <div style={{ marginLeft: '0px', marginBottom:'10px'}}>
          <label>
            <input
              type="radio"
              name="customerType"
              value="Khách đi"
              checked={customerType === 'Khách đi'}
              onChange={(e) => setCustomerType(e.target.value)}
            />
            Khách đi
          </label>
          <label style={{ marginLeft: '20px' }}>
            <input
              type="radio"
              name="customerType"
              value="Khách về"
              checked={customerType === 'Khách về'}
              onChange={(e) => setCustomerType(e.target.value)}
            />
            Khách về
          </label>
        </div>
        <Textfield
          name="soDT"
          placeholder="Điền số điện thoại"
          value={formData.soDT}
          onChange={handleChange}
          onMouseEnter={handleMouseEnter}
          onFocus={handleFocusOther}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <Textfield
          name="soGhe"
          placeholder="Điền số ghế"
          value={formData.soGhe}
          onChange={handleChange}
          onMouseEnter={handleMouseEnter}
          onFocus={handleFocusOther}
        />
      </div>

      <div style={{ marginBottom: '10px', position: 'relative' }}>
        <Textfield
          name="noiDon"
          placeholder="Điền nơi đón"
          value={formData.noiDon}
          onChange={handleChange}
          onMouseEnter={handleMouseEnter}
          onFocus={handleFocusNoiDon}
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
          name="ghiChu"
          placeholder="Điền ghi chú (gửi hàng, say xe, giường dưới, có bé,...)"
          value={formData.ghiChu}
          onChange={handleChange}
          onMouseEnter={handleMouseEnter}
          onFocus={handleFocusOther}
        />
      </div>

      <div style={{ marginBottom: '10px', position: 'relative' }}>
        <Textfield
          name="noiDi"
          placeholder="Điền nơi đi"
          value={formData.noiDi}
          onChange={handleChange}
          onMouseEnter={handleMouseEnter}
          onFocus={handleFocusOther}
        />
        {showSuggestionsNoiDi && suggestionsNoiDi.length > 0 && (
          <ul style={{
              border: '1px solid #ccc',
              padding: '0',
              margin: '0',
              position: 'absolute',
              zIndex: '1000',
              backgroundColor: 'white',
              listStyleType: 'none'
            }}>
            {suggestionsNoiDi.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClickNoiDi(suggestion)} style={{ padding: '8px', cursor: 'pointer' }}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
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

      {submittedData && (
        <div style={{ marginTop: '20px' }}>
          <h5>Thông tin đã gửi:</h5>
          <p><strong>Tài:</strong> {submittedData.tai === 'tai1h' ? 'Tài 1H' : submittedData.tai === 'tai7h' ? 'Tài 7H' : 'Tài 9H'}</p>
          <p><strong>Số điện thoại:</strong> {submittedData.soDT}</p>
          <p><strong>Số ghế:</strong> {submittedData.soGhe}</p>
          <p><strong>Nơi đón:</strong> {submittedData.noiDon}</p>
          <p><strong>Ghi chú:</strong> {submittedData.ghiChu}</p>
          <p><strong>Nơi đi:</strong> {submittedData.noiDi}</p>
        </div>
      )}
    </div>
  );
}

export default DataInputForm;
