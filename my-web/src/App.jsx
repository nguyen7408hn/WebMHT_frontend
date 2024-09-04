import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Card from './Card.jsx';
import DataInputForm from './DataInputForm.jsx';
import ListCustomers from './ListCustomers.jsx';
import UpdateCustomerForm from './UpdateCustomerForm.jsx';

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
      {/* Hiển thị Card chỉ trên trang chủ */}
      {location.pathname === '/' && (
        <div style={{ marginRight: '20px' }}>
          <Card />
        </div>
      )}

      <div>
        <Routes>
          <Route path='/' element={<DataInputForm />} />
          <Route path='/customers' element={<ListCustomers />} />
          <Route path='/updateCustomer/:id' element={<UpdateCustomerForm />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
