const express = require("express");
const app = express();
app.use(express.json());

const weatherData = {
  tokyo: { weather: "sunny", temperature: 28 },
  osaka: { weather: "cloudy", temperature: 26 },
  sapporo: { weather: "snow", temperature: -2 },
};

app.get("/api/weather", (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: "city is required" });
  }

  const data = weatherData[city.toLowerCase()];
});
