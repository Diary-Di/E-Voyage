(function () {
  const { createBusLayout, renderBusState } = window.BusView;
  const { createClient, loadReservations, createReservation } = window.BusReservations;

  const booked = {};
  const selected = new Set();
  const message = document.getElementById("msg");
  const nameInput = document.getElementById("name");
  const matriculeInput = document.getElementById("matricule");
  const reserveButton = document.getElementById("go");
  let client;
  let ready = false;
  let saving = false;

  function showError(error) {
    if (error && error.code === "23505") {
      return "Cette place ou ce matricule est déjà associé à une réservation.";
    }
    return error && error.message ? error.message : String(error);
  }

  function render() {
    renderBusState(booked, selected, ready);
    reserveButton.disabled = !ready || saving || selected.size === 0;
  }

  async function refreshReservations() {
    const reservations = await loadReservations(client);
    Object.keys(booked).forEach(seat => delete booked[seat]);
    Object.assign(booked, reservations);
    ready = true;
    render();
  }

  function toggleSeat(number) {
    if (!ready) return;
    if (booked[number]) {
      message.textContent = "La place " + number + " est déjà réservée.";
      return;
    }

    if (selected.has(number)) {
      selected.delete(number);
    } else {
      selected.clear();
      selected.add(number);
    }
    message.textContent = "";
    render();
  }

  createBusLayout(toggleSeat);
  render();

  document.getElementById("go").onclick = async () => {
    const nom = nameInput.value.trim();
    const matricule = matriculeInput.value.trim();
    const seat = [...selected][0];

    if (!nom) {
      message.textContent = "Veuillez saisir le nom du passager.";
      nameInput.focus();
      return;
    }
    if ([...matricule].length !== 7) {
      message.textContent = "Le matricule doit contenir exactement 7 caractères.";
      matriculeInput.focus();
      return;
    }
    if (seat === undefined) {
      message.textContent = "Veuillez sélectionner une place libre.";
      return;
    }

    saving = true;
    message.textContent = "Enregistrement de la réservation…";
    render();

    try {
      await createReservation(client, { nom, matricule, seat });
    } catch (error) {
      message.textContent = "Échec de la réservation : " + showError(error);
      try {
        await refreshReservations();
      } catch (refreshError) {
        message.textContent += " Impossible d’actualiser les places : " + showError(refreshError);
      }
      saving = false;
      render();
      return;
    }

    selected.clear();
    nameInput.value = "";
    matriculeInput.value = "";
    booked[seat] = "Nom non disponible";
    render();

    try {
      await refreshReservations();
      message.textContent = "Place " + seat + " réservée pour " + nom + ".";
    } catch (error) {
      message.textContent = "Réservation enregistrée, mais l’actualisation a échoué : " + showError(error);
    }

    saving = false;
    render();
  };

  (async function initialize() {
    try {
      client = createClient();
      await refreshReservations();
      message.textContent = "";
    } catch (error) {
      message.textContent = "Connexion Supabase impossible : " + showError(error);
    }
  })();
})();
