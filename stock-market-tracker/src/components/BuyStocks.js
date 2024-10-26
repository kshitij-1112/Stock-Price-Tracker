import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { firestore } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const BuyStocks = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const location = useLocation();
  const { stock } = location.state || {}; // Provide a fallback empty object if state is undefined
  const [numStocks, setNumStocks] = useState(1); // State for number of stocks to buy

  const handleBuy = async () => {
    // Limit number of stocks
    if (numStocks > 100) {
      alert('Number of stocks cannot exceed 100.');
      return;
    }

    // Implement logic for buying stocks
    const totalPriceUSD = numStocks * stock.priceUSD;
    const totalPriceINR = numStocks * stock.priceINR;
    const purchaseData = {
      symbol: stock.symbol,
      description: stock.description,
      priceUSD: stock.priceUSD,
      priceINR: stock.priceINR,
      numStocks: numStocks,
      totalPriceUSD: totalPriceUSD,
      totalPriceINR: totalPriceINR,
      timestamp: new Date().toISOString(), // Convert date to string format
    };

    if (user) {
      try {
        const userId = user.uid;

        const purchaseRef = collection(firestore, 'users', userId, 'purchases');
        await addDoc(purchaseRef, purchaseData);
        alert('Stock purchase details stored successfully!');
        navigate('/stocks');
      } catch (error) {
        console.error('Error adding purchase to Firestore:', error);
        alert('Failed to store purchase details. Please try again later.');
      }
    } else {
      alert('Please log in to buy stocks.');
    }
  };

  if (!stock) {
    return <div>No stock selected.</div>;
  }

  return (
    <div className="buystocks-container">
      <style>
        {`
          .buystocks-container {
            margin-top: 6rem;
            padding: 2rem;
            background-color: #f0f0f0;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: 0 auto;
          }

          .buystocks-container h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: #405d72;
          }

          .buystocks-container p {
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
          }

          .buystocks-container .form-group {
            margin-bottom: 1rem;
          }

          .buystocks-container label {
            font-size: 1.2rem;
            margin-right: 1rem;
          }

          .buystocks-container input[type="number"] {
            padding: 0.5rem;
            font-size: 1rem;
            border: 1px solid #ccc;
            border-radius: 4px;
          }

          .buystocks-container .total-price {
            margin-top: 1rem;
            font-size: 1.2rem;
          }

          .buystocks-container button {
            background-color: #405d72;
            color: #ffffff;
            border: none;
            padding: 0.5rem 1rem;
            cursor: pointer;
            border-radius: 4px;
            transition: background-color 0.3s ease;
          }

          .buystocks-container button:hover {
            background-color: #294050;
          }
        `}
      </style>

      <h1>Buy Stocks</h1>
      <p>Symbol: {stock.symbol}</p>
      <p>Description: {stock.description}</p>
      <p>Price (USD): ${stock.priceUSD.toFixed(2)}</p>
      <p>Price (INR): ₹{stock.priceINR.toFixed(2)}</p>

      <div className="form-group">
        <label htmlFor="numStocks">Number of Stocks:</label>
        <input
          type="number"
          id="numStocks"
          name="numStocks" // Added name attribute
          value={numStocks}
          onChange={(e) => setNumStocks(parseInt(e.target.value))}
          min="1"
          max="100" // Limit maximum number of stocks
          step="1"
        />
      </div>

      <div className="total-price">
        <p>Total Price (USD): ${numStocks * stock.priceUSD}</p>
        <p>Total Price (INR): ₹{numStocks * stock.priceINR}</p>
      </div>

      <button onClick={handleBuy} name="buyButton">Buy</button> {/* Added name attribute */}
    </div>
  );
};

export default BuyStocks;
