import React, { useState, useEffect } from 'react';

const StockTracker = () => {
  // State for stock symbol and data
  const [symbol, setSymbol] = useState('AAPL');
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newSymbol, setNewSymbol] = useState('');

  // Stock data fetching utility
  const fetchStockData = async (stockSymbol) => {
    setLoading(true);
    setError(null);

    try {
      // Using Alpha Vantage free API as an alternative
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=APIKEYHERE`
      );
      const data = await response.json();

      if (data['Global Quote']) {
        const quoteData = data['Global Quote'];
        setStockData({
          symbol: quoteData['01. symbol'],
          price: parseFloat(quoteData['05. price']),
          change: parseFloat(quoteData['09. change']),
          changePercent: quoteData['10. change percent']
        });
      } else {
        setError('Unable to fetch stock data');
      }
    } catch (err) {
      setError('Error fetching stock data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial and periodic data fetch
  useEffect(() => {
    fetchStockData(symbol);
    const intervalId = setInterval(() => fetchStockData(symbol), 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(intervalId);
  }, [symbol]);

  // Change stock symbol
  const handleChangeSymbol = () => {
    if (newSymbol.trim()) {
      setSymbol(newSymbol.toUpperCase());
      setNewSymbol('');
    }
  };

  // Render function
  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '400px', 
      margin: '0 auto', 
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1>Stock Tracker</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : stockData ? (
        <div>
          <h2>{stockData.symbol}</h2>
          <p>Current Price: ${stockData.price.toFixed(2)}</p>
          <p 
            style={{ 
              color: stockData.change >= 0 ? 'green' : 'red',
              fontWeight: 'bold'
            }}
          >
            Change: ${stockData.change.toFixed(2)} ({stockData.changePercent})
          </p>
        </div>
      ) : null}

      <div style={{ marginTop: '20px' }}>
        <input 
          type="text"
          value={newSymbol}
          onChange={(e) => setNewSymbol(e.target.value)}
          placeholder="Enter stock symbol"
          style={{ padding: '5px', marginRight: '10px' }}
        />
        <button 
          onClick={handleChangeSymbol}
          style={{ padding: '5px 10px' }}
        >
          Change Stock
        </button>
      </div>
    </div>
  );
};

export default StockTracker;