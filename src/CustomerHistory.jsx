import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ thêm
import backIcon from './icon/back.png'; // ✅ import ảnh

function CustomerHistory() {
  const [histories, setHistories] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10)); // YYYY-MM-DD
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate(); // ✅ thêm

  // Format hiển thị dd-MM-yyyy
  const formatDateDisplay = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  // Format thời gian dd-MM-yyyy HH:mm
  const formatDateTime = (datetimeStr) => {
    const d = new Date(datetimeStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_URL}/identity/CustomerHistory/by-date`, {
          params: { date: selectedDate }
        });
        setHistories(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy lịch sử:", err);
      }
    };
    fetchHistory();
  }, [selectedDate, API_URL]);

  return (
    <div className="container">
      <button
        className="btn"
        onClick={() => navigate('/customers')}
        style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
        }}
        >
        <img
            src={backIcon}
            alt="Quay lại"
            style={{ width: '24px', height: '24px' }}
        />
        <span>Quay lại danh sách</span>
      </button>
      <h4>Lịch sử khách hàng ngày {formatDateDisplay(selectedDate)}</h4>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>SĐT</th>
            <th>Số vé</th>
            <th>Nơi đón</th>
            <th>Nơi đi</th>
            <th>Ghi chú</th>
            <th>Tài</th>
            <th>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {histories.map((h, index) => (
            <tr key={index}>
              <td>{h.sdt}</td>
              <td>{h.sove}</td>
              <td>{h.noidon}</td>
              <td>{h.noidi}</td>
              <td>{h.ghichu}</td>
              <td>{h.tai}</td>
              <td>{formatDateTime(h.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerHistory;
