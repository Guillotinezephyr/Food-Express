import React, { useState } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import AppDownload from '../../components/AppDownload/AppDownload';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import FoodRecommendations from '../../components/FoodRecommendations/FoodRecommendations';

const Home = () => {
    const [category, setCategory] = useState("All");
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Example data for user orders and all food items
    const userOrders = [
        { id: 1, name: 'Pizza', category: 'Italian', price: 250 },
        { id: 2, name: 'Pasta', category: 'Italian', price: 200 },
    ];

    const allFoodItems = [
        { id: 1, name: 'Pizza', category: 'Italian', price: 250, image: 'pizza.jpg' },
        { id: 2, name: 'Pasta', category: 'Italian', price: 200, image: 'pasta.jpg' },
        { id: 3, name: 'Burger', category: 'Fast Food', price: 150, image: 'burger.jpg' },
        { id: 4, name: 'Fries', category: 'Fast Food', price: 100, image: 'fries.jpg' },
        { id: 5, name: 'Tacos', category: 'Mexican', price: 180, image: 'tacos.jpg' },
    ];

    return (
        <div>
            <div className="date-time-picker">
                <label className="delivery-label">Select Date and Time for delivery:</label>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    showTimeSelect
                    dateFormat="Pp"
                    className="custom-datepicker"
                />
                <p className="delivery-message">
                    Your order will be delivered on <strong>{selectedDate.toLocaleString()}</strong>.
                </p>
            </div>
            <Header />
            <ExploreMenu category={category} setCategory={setCategory} />
            <FoodDisplay category={category} />
            
            {/* Food Recommendations Section */}
            <FoodRecommendations userOrders={userOrders} allFoodItems={allFoodItems} />

            <AppDownload />
        </div>
    );
};

export default Home;