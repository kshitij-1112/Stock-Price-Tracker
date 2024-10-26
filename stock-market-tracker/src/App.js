import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import StockList from './components/StockList';
import Header from './components/Header';
import Favorites from './components/Favorites';
import BuyStocks from './components/BuyStocks';
import MyStocks from './components/MyStocks';
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/stocks" element={<StockList />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/buystocks" element={<BuyStocks />} />
            <Route path="/mystocks" element={<MyStocks />} />
            <Route path="/" element={<Header />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

// Example of a separate HomePage component

export default App;
