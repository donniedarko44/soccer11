exports.handler = async function(event) {
  const { id } = event.queryStringParameters || {};

  if (!id) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing player id" }) };
  }

  try {
    const res = await fetch(
      `https://v3.football.api-sports.io/players?id=${id}&season=2025`,
      {
        method: "GET",
        headers: { "x-apisports-key": process.env.API_FOOTBALL_KEY }
      }
    );

    const data = await res.json();
    const entry = data.response?.[0];

    if (!entry) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appearances: null, minutes: null })
      };
    }

    let appearances = 0, minutes = 0;
    (entry.statistics || []).forEach(stat => {
      appearances += stat.games?.appearences || 0;
      minutes     += stat.games?.minutes     || 0;
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appearances, minutes })
    };

  } catch (e) {
    console.error(`Error fetching player ${id}:`, e);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appearances: null, minutes: null })
    };
  }
};
