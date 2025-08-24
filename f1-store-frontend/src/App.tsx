import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Footer, ProtectedAdminRoute } from './components';
import { Home, Teams, TeamProducts, Drivers, DriverProducts, SignUp, SignIn, ProductDetail, Admin, AddProduct, Cart, OrderSuccess, OrderHistory } from './pages';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/:teamId/products" element={<TeamProducts />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/drivers/:driverId/products" element={<DriverProducts />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order-success/:orderNumber" element={<OrderSuccess />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/admin" element={
              <ProtectedAdminRoute>
                <Admin />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/add-product" element={
              <ProtectedAdminRoute>
                <AddProduct />
              </ProtectedAdminRoute>
            } />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;