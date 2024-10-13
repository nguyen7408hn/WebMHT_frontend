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
  
      // Prepare data for the placeholders
      const data = {
        tai: taiLabel || '', // Sử dụng taiLabel
      };
  
      // Chỉ thêm dữ liệu cho các khách hàng có thông tin thực tế
      customers.forEach((customer, index) => {
        // Định dạng lại số điện thoại thành 4-3-3
        const formattedPhone = customer.sdt
        ? `${customer.sdt.substring(0, 4)} ${customer.sdt.substring(4, 7)} ${customer.sdt.substring(7)}`
        : ''; // Nếu không có số điện thoại thì để trống

        data[`sdt${index + 1}`] = formattedPhone; // Sử dụng số điện thoại đã định dạng
        data[`sove${index + 1}`] = customer.sove || ''; // Nếu không có sove thì để trống
        data[`noidon${index + 1}`] = customer.noidon || ''; // Nếu không có noidon thì để trống
        data[`noidi${index + 1}`] = customer.noidi || ''; // Nếu không có noidi thì để trống
      });
  
      // Thay thế các nhãn không có dữ liệu bằng khoảng trống
      for (let i = customers.length ; i < 1000; i++) {
        data[`sdt${i + 1}`] = '';
        data[`sove${i + 1}`] = '';
        data[`noidon${i + 1}`] = '';
        data[`noidi${i + 1}`] = '';
      }
  
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
