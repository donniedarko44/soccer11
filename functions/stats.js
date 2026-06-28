export async function onRequestGet({ request, env }) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing player id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const res = await fetch(
      `https://v3.football.api-sports.io/players?id=${id}&season=2024`,
      {
        method: "GET",
        headers: { "x-apisports-key": env.API_FOOTBALL_KEY }
      }
    );

    const data = await res.json();
    const entry = data.response?.[0];

    if (!entry) {
      return new Response(JSON.stringify({ appearances: null, minutes: null }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    let appearances = 0, minutes = 0;
    (entry.statistics || []).forEach(stat => {
      appearances += stat.games?.appearences || 0;
      minutes     += stat.games?.minutes     || 0;
    });

    return new Response(JSON.stringify({ appearances, minutes }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    console.error(`Error fetching player ${id}:`, e);
    return new Response(JSON.stringify({ appearances: null, minutes: null }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
}
