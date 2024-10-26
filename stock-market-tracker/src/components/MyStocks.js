import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { firestore } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import Chart from 'chart.js/auto';

const MyStocks = () => {
  const [user] = useAuthState(auth);
  const [purchasedStocks, setPurchasedStocks] = useState([]);
  const [pieChart, setPieChart] = useState(null); // State to hold the chart instance

  useEffect(() => {
    const fetchPurchasedStocks = async () => {
      if (user) {
        try {
          const purchasesRef = collection(firestore, 'users', user.uid, 'purchases');
          const purchasesQuery = query(purchasesRef);
          const querySnapshot = await getDocs(purchasesQuery);
          const stocksData = querySnapshot.docs.map(doc => doc.data());
          setPurchasedStocks(stocksData);
        } catch (error) {
          console.error('Error fetching purchased stocks:', error);
          alert('Failed to fetch purchased stocks. Please try again later.');
        }
      }
    };

    fetchPurchasedStocks();
  }, [user]);

  const handleAnalyse = async (symbol, index) => {
    try {
      const apiKey = 'cq4jqn1r01qr4urillf0cq4jqn1r01qr4urillfg';
      const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);

      if (response.status === 200) {
        const currentPriceUSD = response.data.c;
        const currentPriceINR = currentPriceUSD * 83; // Assuming 1 USD = 83 INR
        const percentageChange = ((currentPriceUSD - purchasedStocks[index].priceUSD) / purchasedStocks[index].priceUSD) * 100;
        const numStocks = purchasedStocks[index].numStocks || 0; // Ensure numStocks is a number
        const currentTotalPriceUSD = currentPriceUSD * numStocks;
        const currentTotalPriceINR = currentPriceINR * numStocks;

        // Update the state with the analysed data
        setPurchasedStocks(prevStocks => {
          const updatedStocks = [...prevStocks];
          updatedStocks[index] = {
            ...updatedStocks[index],
            currentPriceUSD,
            currentPriceINR,
            percentageChange,
            currentTotalPriceUSD,
            currentTotalPriceINR,
            analysed: true, // Flag to indicate that the stock has been analysed
          };
          return updatedStocks;
        });
      } else {
        console.error('Failed to fetch current price:', response.status);
        alert('Failed to fetch current price. Please try again later.');
      }
    } catch (error) {
      console.error('Error analysing stock:', error);
      alert('Failed to analyse stock. Please try again later.');
    }
  };

  const handleCollapse = (index) => {
    setPurchasedStocks(prevStocks => {
      const updatedStocks = [...prevStocks];
      updatedStocks[index] = {
        ...updatedStocks[index],
        analysed: false, // Hide analysed data
      };
      return updatedStocks;
    });
  };

  useEffect(() => {
    if (purchasedStocks.length > 0) {
      if (pieChart) {
        pieChart.destroy(); // Destroy existing chart if it exists
      }
      createPieChart();
    }
  }, [purchasedStocks]);

  const createPieChart = () => {
    const ctx = document.getElementById('pieChart');

    if (!ctx) return; // Return if canvas context is not available

    const newPieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: purchasedStocks.map(stock => stock.symbol),
        datasets: [{
          label: 'Portfolio Distribution (INR)',
          data: purchasedStocks.map(stock => stock.totalPriceINR),
          backgroundColor: purchasedStocks.map(stock => '#' + Math.floor(Math.random() * 16777215).toString(16)),
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Portfolio Distribution (INR)',
          },
        },
      },
    });

    setPieChart(newPieChart); // Set the chart instance in state
  };

  return (
    <div className="mystocks-container">
      <style>
        {`
          /* CSS styles remain unchanged */
          .mystocks-container {
            margin-top: 6rem;
            padding: 2rem;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            background-color: #405d72;
            color: #f0f0f0;
            border-radius: 12px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            margin-bottom: 2rem;
            position: fixed;
            top: 60px;
            width: 100%;
          }

          .stock-list {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            gap: 2rem;
          }

          .card {
            width: calc(25% - 1rem);
            margin-bottom: 1rem;
            padding: 1rem;
            background-color: #f0f0f0;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }

          .card-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 1rem;
          }

          .card-buttons {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 1rem;
            gap: 0.5rem;
          }

          .button-shadow {
            background-color: #405D72;
            color: #ffffff;
            border: none;
            padding: 0.5rem 1rem;
            cursor: pointer;
            border-radius: 4px;
            transition: background-color 0.3s ease;
          }

          .button-shadow:hover {
            background-color: #294050;
          }

          .analysed-data {
            margin-top: 1rem;
            font-size: 0.9rem;
            color: #666;
          }

          .pie-chart-container {
            width: 400px;
            height: 400px;
            margin: 2rem auto; /* Center horizontally with auto margins */
            display: flex;
            justify-content: center; /* Center horizontally */
            align-items: center; /* Center vertically */
          }

          #pieChart {
            width: 100%;
            height: 100%;
          }
        `}
      </style>

      <div className="header">
        <h1>My Purchased Stocks</h1>
      </div>

      <div className="stock-list">
        {purchasedStocks.length > 0 ? (
          purchasedStocks.map((stock, index) => (
            <div key={index} className="card">
              <div className="card-content">
                <h3>{stock.symbol}</h3>
                <p>{stock.description}</p>
                <p>Price (USD): ${stock.priceUSD ? stock.priceUSD.toFixed(2) : 'N/A'}</p>
                <p>Price (INR): ₹{stock.priceINR ? stock.priceINR.toFixed(2) : 'N/A'}</p>
                <p>Quantity: {stock.numStocks}</p>
                <p>Total Price (USD): ${stock.totalPriceUSD ? stock.totalPriceUSD.toFixed(2) : 'N/A'}</p>
                <p>Total Price (INR): ₹{stock.totalPriceINR ? stock.totalPriceINR.toFixed(2) : 'N/A'}</p>

                {stock.analysed && (
                  <div className="analysed-data">
                    <p>Current Price (USD): ${stock.currentPriceUSD.toFixed(2)}</p>
                    <p>Current Price (INR): ₹{stock.currentPriceINR.toFixed(2)}</p>
                    <p>Percentage Change: {stock.percentageChange.toFixed(2)}%</p>
                    <p>Current Total Price (USD): ${stock.currentTotalPriceUSD.toFixed(2)}</p>
                    <p>Current Total Price (INR): ₹{stock.currentTotalPriceINR.toFixed(2)}</p>
                  </div>
                )}

                <div className="card-buttons">
                  {stock.analysed && (
                    <button className="button-shadow" onClick={() => handleCollapse(index)} name="collapseButton">
                      {stock.collapsed ? 'Expand' : 'Collapse'}
                    </button>
                  )}
                  {!stock.analysed && (
                    <button className="button-shadow" onClick={() => handleAnalyse(stock.symbol, index)} name="analyseButton">
                      Analyse
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No purchased stocks found.</p>
        )}
      </div>

      <div className="pie-chart-container">
        <canvas id="pieChart"></canvas>
      </div>
    </div>
  );
};

export default MyStocks;
