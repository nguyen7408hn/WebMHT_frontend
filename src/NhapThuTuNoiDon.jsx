import { useState, useEffect } from 'react';
import Textfield from '@atlaskit/textfield';
import Button from "./Button.jsx";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


function NhapThuTuNoiDon() {
    const [formData, setFormData] = useState({
        noiDon: '',
        thuTu: ''
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [messageVisible, setMessageVisible] = useState(true); 

    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleGoToList=()=>{
        navigate('/listthutunoidon');
    };

    useEffect(() => {
      if (messageVisible) {
        const timer = setTimeout(() => {
          setMessageVisible(false);
        }, 3000);
  
        return () => clearTimeout(timer);
      }
    }, [messageVisible]);

    const handleMouseEnter = () => {
      setMessageVisible(false);
    };

    const handleSubmit = async () => {
        let endpoint = `${API_URL}/identity/ThuTuNoiDon`;
    
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              id: formData.id,
              noidon: formData.noiDon,
              thutu: formData.thuTu
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

    return (
        <div>
            <h2 className='text-center'>Nhập thứ tự nơi đón</h2>
            <div style={{ display: 'flex', marginBottom: '10px' }}>
                <div style={{ flex: 3, marginRight: '10px' }}>
                    <Textfield
                        name="noiDon"
                        placeholder="Điền nơi đón"
                        value={formData.noiDon}
                        onChange={handleChange}
                        onMouseEnter={handleMouseEnter}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <Textfield
                        name="thuTu"
                        placeholder="Điền thứ tự"
                        value={formData.thuTu}
                        onChange={handleChange}
                        onMouseEnter={handleMouseEnter}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '35px', marginBottom: '10px' }}>
                <Button onClick={handleSubmit}>Gửi</Button>
                <Button onClick={handleGoToList}>Xem</Button>
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

export default NhapThuTuNoiDon;
