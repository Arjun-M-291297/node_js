import express from "express";
import axios from "axios";
import CircuitBreaker from "opossum";

const app = express();

// Circuit breaker options
const options = {
  timeout: 3500,
  errorThresholdPercentage: 50,
  resetTimeout: 10000, // try again after 10s
};

// Function to call order-service
async function fetchOrders(userId) {
  const response = await axios.get(`http://localhost:4001/orders/${userId}`, {
    timeout: 3000, // fail fast if it takes >3s
  });
  return response.data;
}

const breaker = new CircuitBreaker(fetchOrders, options);

// Optional fallback (so user-service doesn’t break)
breaker.fallback(() => [{ id: 0, item: "No orders (fallback)" }]);

// Log state changes
breaker.on("open", () => console.log("⚡ Circuit opened — order service unhealthy"));
breaker.on("halfOpen", () => console.log("🧪 Trying order service again..."));
breaker.on("close", () => console.log("✅ Circuit closed — order service recovered"));

app.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await breaker.fire(id);
    res.json({
      id,
      name: "Arjun",
      orders: orders.data,
    });
  } catch (err) {
    console.error("Error calling order service:", err.message);
    res.status(500).json({ error: "Failed to fetch orders!" });
  }
});

app.listen(4000, () => console.log("User service running on port 4000"));
