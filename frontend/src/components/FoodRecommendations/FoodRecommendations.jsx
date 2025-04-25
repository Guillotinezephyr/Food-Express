import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FoodRecommendations.css';

const FoodRecommendations = ({ userOrders, allFoodItems }) => {
  const [recommendations, setRecommendations] = useState([]);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.post('/api/recommend', {
        userOrders,
        allFoodItems,
      });
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [userOrders, allFoodItems]);

  return (
    <div className="food-recommendations">
      <h3>Recommended for You</h3>
      <div className="recommendations-list">
        {recommendations.map((item) => (
          <div key={item.id} className="recommendation-item">
            <img src={`/images/${item.image}`} alt={item.name} />
            <p>{item.name}</p>
            <p>₹{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodRecommendations;