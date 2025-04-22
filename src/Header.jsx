import PropTypes from 'prop-types'; // ✅ thêm dòng này
import './Header.css';
import codingIcon from './icon/coding.png';
import printIcon from './icon/printer.png';
import arrangeIcon from './icon/sapxep.png';
import noidonIcon from './icon/noidon.png';
import logo from './icon/mhtremove.png';
import historyIcon from './icon/history.png';

const Header = ({ onNhap, onIn, onSapXep, onNoiDon, onLichSu }) => {
  return (
    <header className="custom-header">
      <div className="logo">
        <img src={logo} alt="Logo MHT" className="logo-img" />
      </div>
      <nav className="header-buttons">
        <button onClick={onNhap} title="Nhập">
            <img src={codingIcon} alt="Nhập" />
        </button>
        <button onClick={onIn} title="In">
            <img src={printIcon} alt="In" />     
        </button>
        <button onClick={onSapXep} title="Sắp xếp">
            <img src={arrangeIcon} alt="Sắp xếp" />     
        </button>
        <button onClick={onNoiDon} title="Danh sách nơi đón">
            <img src={noidonIcon} alt="Nơi đón" />
        </button>
        <button onClick={onLichSu} title="Xem lịch sử">
            <img src={historyIcon} alt="Lịch sử" />
        </button>
      </nav>
    </header>
  );
};

Header.propTypes = {
  onNhap: PropTypes.func.isRequired,
  onIn: PropTypes.func.isRequired,
  onSapXep: PropTypes.func.isRequired,
  onNoiDon: PropTypes.func.isRequired,
  onLichSu: PropTypes.func.isRequired, // ✅ thêm dòng này
};

export default Header;