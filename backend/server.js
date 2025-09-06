const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 5001;

app.get("/menu", (req, res) => {
  fs.readFile("Menu.json", "utf-8", (err, data) => {
    if (err) return res.status(500).send("Error reading menu");
    res.json(JSON.parse(data));
  });
});

app.get("/all_orders", (req, res) => {
  fs.readFile("Orders.json", "utf-8", (err, data) => {
    if (err) return res.status(500).send("Error reading orders");
    res.json(JSON.parse(data));
  });
});

app.post("/order", (req, res) => {
  const { items, total } = req.body;
  const newOrder = {
    id: uuidv4(),
    items,
    total,
    timestamp: new Date().toISOString()
  };

  fs.readFile("Orders.json", "utf-8", (err, data) => {
    if (err) return res.status(500).send("Error reading orders");
    const orders = JSON.parse(data);
    orders.push(newOrder);
    fs.writeFile("Orders.json", JSON.stringify(orders, null, 2), (err) => {
      if (err) return res.status(500).send("Error saving order");
      res.json({ success: true, order: newOrder });
    });
  });
});

app.post("/all_orders", (req, res) => {
  const updatedOrders = req.body;

  fs.writeFile("Orders.json", JSON.stringify(updatedOrders, null, 2), (err) => {
    if (err) return res.status(500).send("Error updating orders");
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


