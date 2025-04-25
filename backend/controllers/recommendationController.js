exports.getRecommendations = (req, res) => {
  const { userOrders, allFoodItems } = req.body;

  // Recommendation logic
  const recommendFood = (userOrders, allFoodItems) => {
    if (!userOrders || userOrders.length === 0) {
      return allFoodItems.slice(0, 5); // Top 5 items if no orders
    }

    const lastOrderCategory = userOrders[userOrders.length - 1]?.category;

    return allFoodItems.filter(
      (item) =>
        item.category === lastOrderCategory &&
        !userOrders.some((order) => order.id === item.id)
    ).slice(0, 5);
  };

  const recommendations = recommendFood(userOrders, allFoodItems);

  res.json({ success: true, recommendations });
};