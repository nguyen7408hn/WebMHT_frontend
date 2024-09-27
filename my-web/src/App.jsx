import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Card from './Card.jsx';
import DataInputForm from './DataInputForm.jsx';
import ListCustomers from './ListCustomers.jsx';
import ListCustomers7H from './ListCustomers7H.jsx';
import ListCustomers9H from './ListCustomers9H.jsx';
import UpdateCustomerForm1H from './UpdateCustomerForm1H.jsx';
import UpdateCustomerForm7H from './UpdateCustomerForm7H.jsx';
import UpdateCustomerForm9H from './UpdateCustomerForm9H.jsx';
import NhapThuTuNoiDon from './NhapThuTuNoiDon.jsx';
import DanhSachNoiDon from './DanhSachNoiDon.jsx';
import UpdateThuTuNoiDon from './updateThuTuNoiDon.jsx';


function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '100vh', paddingTop: '20px' }}>
        <AppContent />
      </div>
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {location.pathname === '/' && (
        <div style={{ marginRight: '20px' }}>
          <Card />
        </div>
      )}
        
      <div>
        <Routes>
          <Route path='/' element={<DataInputForm />} />
          <Route path='/customers1H' element={<ListCustomers />} />
          <Route path='/customers7H' element={<ListCustomers7H />} />
          <Route path='/customers9H' element={<ListCustomers9H />} />
          <Route path='/updateCustomer1h/:id' element={<UpdateCustomerForm1H />} />
          <Route path='/updateCustomer7h/:id' element={<UpdateCustomerForm7H />} />
          <Route path='/updateCustomer9h/:id' element={<UpdateCustomerForm9H />} />
          <Route path='/updateThuTuNoiDon/:id' element={<UpdateThuTuNoiDon />} />
          <Route path='/nhapnoidon' element={<NhapThuTuNoiDon/>}/>
          <Route path='/listthutunoidon' element={<DanhSachNoiDon/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
