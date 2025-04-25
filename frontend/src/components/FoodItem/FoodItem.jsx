import React, { useContext, useState } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

function FoodItem({ id, name, price, description, image, category, allFoodItems }) {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);
  const [suggestedFood, setSuggestedFood] = useState(null);

  const handleAddToCart = (id) => {
    addToCart(id);

    console.log('All Food Items:', allFoodItems);
    console.log('Current Category:', category);

    const similarFood = allFoodItems.find(
      (item) => item.category === category && item.id !== id
    );

    console.log('Similar Food Found:', similarFood);

    if (similarFood) {
      setSuggestedFood(similarFood);
    } else {
      setSuggestedFood({ name: 'No similar food found', price: 0 });
    }
  };

  const closePopup = () => {
    setSuggestedFood(null);
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img className="food-item-image" src={url + '/images/' + image} alt="" />
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => handleAddToCart(id)}
            src={assets.add_icon_white}
            alt=""
          />
        ) : (
          <div className="food-item-counter">
            <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="" />
            <p className="cartitemsp">{cartItems[id]}</p>
            <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="" />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p className="namewe">{name}</p>
          <img className="ratingstars" src={assets.rating_starts} alt="" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">₹{price}</p>
      </div>

      {/* Popup for suggested food */}
      {suggestedFood && (
        <div className="suggestion-popup">
          <div className="popup-content">
            <h3>You might also like:</h3>
            <p className="suggested-food-text">
              {suggestedFood.name} - ₹{suggestedFood.price}
            </p>
            <button className="close-popup" onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}
      {console.log('Suggested Food:', suggestedFood)}
    </div>
  );
}

export default FoodItem;