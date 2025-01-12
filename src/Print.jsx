import { useNavigate, useLocation } from 'react-router-dom';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import JSZipUtils from 'jszip-utils';
import template from './template_placeholder.docx'; // Đảm bảo đường dẫn đúng
import Button from "./Button";

const Print = () => {
  const location = useLocation();
  const customers = location.state?.customers || [];
  const taiLabel = location.state?.taiLabel || ''; // Nhận giá trị tai từ location.state
  const veDi = location.state?.veDi || 0; // Lấy giá trị vé đi
  const navigate = useNavigate();

  const loadFile = (url, callback) => {
    JSZipUtils.getBinaryContent(url, callback);
  };

  const handleView = () => {
    if (!taiLabel) {
      console.log('taiLabel không có giá trị');
      return; // Thoát hàm nếu taiLabel không có giá trị
    }

    // Sử dụng switch để điều hướng tương ứng với taiLabel
    switch (taiLabel) {
      case 'Tài 1h':
        navigate('/customers', { state: { tai: 'tai1h' } });
        break;
      case 'Tài 7h':
        navigate('/customers', { state: { tai: 'tai7h' } });
        break;
      case 'Tài 9h':
        navigate('/customers', { state: { tai: 'tai9h' } });
        break;
      default:
        console.log('Giá trị tai không hợp lệ');
    }
  };

  // Hàm định dạng số điện thoại
const formatPhoneNumber = (phoneNumber) => {
  // Kiểm tra nếu số điện thoại bắt đầu bằng "Về"
  if (phoneNumber.startsWith('Về ')) {
    // Lấy phần số điện thoại và áp dụng định dạng
    const formattedPhone = phoneNumber.replace('Về ', '').replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
    return `Về ${formattedPhone}`;
  } else {
    // Nếu không có "Về", chỉ định dạng số điện thoại
    return phoneNumber.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  }
};

  const handlePrint = () => {
    // Load the Word template
    loadFile(template, (error, content) => {
      if (error) {
        console.error("Error loading file:", error);
        alert("Có lỗi xảy ra khi tải file mẫu. Vui lòng kiểm tra lại.");
        return;
      }
  
      console.log("File loaded successfully");
  
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      // Get current date
      const today = new Date();
      today.setDate(today.getDate() + 1); // Thêm 1 ngày vào hôm nay để lấy ngày mai

      const options = { weekday: 'long' }; // Để lấy tên đầy đủ của ngày trong tuần
      const thu = today.toLocaleDateString('vi-VN', options); // Tên ngày trong tuần bằng tiếng Việt
      const d = today.getDate(); // Ngày trong tháng
      const m = today.getMonth() + 1; // Tháng (chỉ số bắt đầu từ 0, nên cộng 1)
      const y = today.getFullYear(); // Năm đầy đủ
  
      // Prepare data for the placeholders
      const data = {
        tai: taiLabel === 'Tài 1h' ? '1' : taiLabel === 'Tài 7h' ? '7' : taiLabel === 'Tài 9h' ? '9' : '',
        thu: thu,
        d: d,
        m: m,
        y: y,
        sum: veDi,
      };
  
      // Chỉ thêm dữ liệu cho các khách hàng có thông tin thực tế
    customers.forEach((customer, index) => {
      // Định dạng lại số điện thoại thành 4-3-3, với tiền tố "Về" nếu là khách về
      const formattedPhone = customer.sdt
        ? formatPhoneNumber(customer.sdt) // Áp dụng hàm định dạng
        : ''; // Nếu không có số điện thoại thì để trống

      data[`sdt${index + 1}`] = formattedPhone; // Sử dụng số điện thoại đã định dạng
      data[`g${index + 1}`] = customer.sove || ''; // Nếu không có sove thì để trống
      data[`noidon${index + 1}`] = customer.noidon || ''; // Nếu không có noidon thì để trống
      data[`noidi${index + 1}`] = customer.noidi || ''; // Nếu không có noidi thì để trống
      data[`c${index + 1}`] = customer.ghichu ? `(${customer.ghichu})` : ''; // Nếu không có ghichu thì để trống
    });
  
      // Thay thế các nhãn không có dữ liệu bằng khoảng trống
      for (let i = customers.length ; i < 1000; i++) {
        data[`sdt${i + 1}`] = '';
        data[`g${i + 1}`] = '';
        data[`noidon${i + 1}`] = '';
        data[`noidi${i + 1}`] = '';
        data[`c${i + 1}`] = '';
      }

      // Tính tổng số vé cho các nhóm khách hàng
      const totalTickets = Array(Math.ceil(customers.length / 17)).fill(0);
      customers.forEach((customer, index) => {
        const groupIndex = Math.floor(index / 17);
        totalTickets[groupIndex] += customer.sove || 0; // Cộng số vé của từng khách hàng vào nhóm tương ứng
      });

      // Thay thế các nhãn {di1}, {di2}, ...
      totalTickets.forEach((total, index) => {
        data[`di${index + 1}`] = total; // Thay thế nhãn {di1}, {di2}, ...
      });
  
      // Set the data into the template
      doc.render(data);
  
      // Generate the document and trigger download
      const output = doc.getZip().generate({ type: 'blob' });
      saveAs(output, 'Danh_sach_khach_hang.docx');
    });
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <Button
        onClick={handleView}
        style={{ marginBottom: '10px', padding: '10px 20px', fontSize: '16px' }}
      >
        Quay về danh sách khách
      </Button>
      <Button
        onClick={handlePrint}
        style={{ marginBottom: '10px', padding: '10px 20px', fontSize: '16px' }}
      >
        Tải về danh sách khách
      </Button>
    </div>
  );
};

export default Print;
