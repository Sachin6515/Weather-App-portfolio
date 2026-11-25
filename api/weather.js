
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const city = String(req.query.city || "").trim();
  const type = req.query.type === "forecast" ? "forecast" : "weather";

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const url = new URL(
      `https://api.openweathermap.org/data/2.5/${type}`
    );

    url.search = new URLSearchParams({
      q: city,
      appid: apiKey,
      units: "metric"
    }).toString();

    const response = await fetch(url);
    const data = await response.json();

    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({
      error: "Unable to fetch weather data"
    });
  }
}
