import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
const Favorites = () => {
  const [user] = useAuthState(auth);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        const favoritesRef = collection(firestore, 'users', user.uid, 'favorites');
        const q = query(favoritesRef);
        const querySnapshot = await getDocs(q);
        const favoritesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFavorites(favoritesData);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleRemoveFavorite = async (id) => {
    try {
      const favoriteDocRef = doc(firestore, 'users', user.uid, 'favorites', id);
      await deleteDoc(favoriteDocRef);
      setFavorites(favorites.filter(favorite => favorite.id !== id));
      console.log('Stock removed from favorites');
    } catch (error) {
      console.error('Error removing stock from favorites:', error);
    }
  };

  return (
    <div className="favorites-container">
      <style>
        {`
        .header {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
          background-color: #405d72;
          color: #f0f0f0;
          position: fixed;
          top: 55px;
          width: 100%;
          max-width: 100%;
          border-radius: 12px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
          z-index: 1000;
        }

        .favorites-container {
          margin-top: 6rem;
          padding: 2rem;
        }

        .favorite-item {
          margin-bottom: 1rem;
          padding: 1rem;
          background-color: #f0f0f0;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .favorite-item strong {
          margin-right: 0.5rem;
        }

        .remove-button {
          background-color: #d32f2f;
          color: #ffffff;
          border: none;
          padding: 0.5rem 1rem;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.3s ease;
        }

        .remove-button:hover {
          background-color: #b71c1c;
        }
        `}
      </style>

      <div className="header">
        <h1>Favorites</h1>
      </div>

      <div className="favorites-container">
        <ul>
          {favorites.map((favorite, index) => (
            <li key={index} className="favorite-item">
              <strong>Symbol:</strong> {favorite.symbol}, <strong>Description:</strong> {favorite.description},
              {favorite.priceUSD && typeof favorite.priceUSD === 'number' && (
                <>
                  <strong>Price (USD):</strong> ${favorite.priceUSD.toFixed(2)},
                </>
              )}
              {favorite.priceINR && typeof favorite.priceINR === 'number' && (
                <>
                  <strong>Price (INR):</strong> ₹{favorite.priceINR.toFixed(2)}
                </>
              )}
              <button className="remove-button" onClick={() => handleRemoveFavorite(favorite.id)} name="remove">Remove</button>

            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Favorites;
