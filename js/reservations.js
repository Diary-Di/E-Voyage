(function () {
  const config = window.SUPABASE_CONFIG;
  const tripId = config && config.tripId ? config.tripId : "bus-1";

  function createClient() {
    if (!window.supabase) {
      throw new Error("La bibliothèque Supabase n’a pas pu être chargée.");
    }
    if (!config || !config.url || !config.anonKey ||
        config.url.includes("YOUR_PROJECT_ID") || config.anonKey.includes("YOUR_SUPABASE_ANON_KEY")) {
      throw new Error("Configurez l’URL et la clé anon dans js/supabase-config.js.");
    }

    return window.supabase.createClient(config.url, config.anonKey);
  }

  async function loadReservations(client) {
    const { data, error } = await client
      .from("places_occupees")
      .select("trip_id, seat")
      .eq("trip_id", tripId)
      .limit(26);

    if (error) throw error;

    return Object.fromEntries(data.map(({ seat }) => [seat, "Nom non disponible"]));
  }

  async function createReservation(client, reservation) {
    const { error } = await client.from("reservations").insert({
      trip_id: tripId,
      matricule: reservation.matricule,
      nom: reservation.nom,
      seat: reservation.seat
    });

    if (error) throw error;
  }

  window.BusReservations = { createClient, loadReservations, createReservation };
})();
