import express from "express";
const app = express();

app.get("/orders/:userId", (req, res) => {
  const { userId } = req.params;

  // Simulate slow or failing downstream system
  const random = Math.random();
  if (random < 0.6) {
    // 60% chance of failure
    return res.status(500).json({ error: "Order service failed!" });
  }

  // Simulate slow response
  setTimeout(() => {
    res.json([{ id: 1, userId, item: "Laptop" }]);
  }, 4000); // 4s delay
});

app.listen(4001, () => console.log("Order service running on port 4001"));
