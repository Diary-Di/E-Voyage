(function () {
  function createSeat(number, onSelect) {
    const seat = document.createElement("button");
    seat.className = "seat";
    seat.textContent = number;
    seat.dataset.n = number;
    seat.onclick = () => onSelect(number);
    return seat;
  }

  function createBusLayout(onSelect) {
    const front = document.getElementById("front");
    [1, 2].forEach(number => front.appendChild(createSeat(number, onSelect)));

    const rows = document.getElementById("rows");
    for (let row = 0; row < 6; row++) {
      const firstSeat = 3 + row * 4;
      [0, 1].forEach(offset => rows.appendChild(createSeat(firstSeat + offset, onSelect)));
      const aisle = document.createElement("span");
      rows.appendChild(aisle);
      [2, 3].forEach(offset => rows.appendChild(createSeat(firstSeat + offset, onSelect)));
    }
  }

  function renderReservations(booked) {
    const groups = new Map();
    Object.entries(booked).forEach(([seat, name]) => {
      if (!groups.has(name)) groups.set(name, []);
      groups.get(name).push(Number(seat));
    });

    const list = document.getElementById("list");
    list.replaceChildren();

    if (groups.size === 0) {
      const item = document.createElement("li");
      const message = document.createElement("span");
      message.className = "sub";
      message.textContent = "Aucune réservation.";
      item.appendChild(message);
      list.appendChild(item);
    }

    groups.forEach((seats, name) => {
      seats.sort((a, b) => a - b);
      const item = document.createElement("li");
      const description = document.createElement("span");
      if (name === "Indisponible") {
        description.textContent = "Place " + seats.join(", ") + " (indisponible)";
      } else {
        description.textContent =
          (name === "Nom non disponible" ? "Place" : name + " – place") +
          (seats.length > 1 ? "s " : " ") + seats.join(", ") +
          (name === "Nom non disponible" ? " (réservée)" : "");
      }
      item.append(description);
      list.appendChild(item);
    });
  }

  function renderBusState(booked, selected, ready) {
    document.querySelectorAll(".seat").forEach(seat => {
      const number = Number(seat.dataset.n);
      seat.className = "seat" + (booked[number] ? " res" : selected.has(number) ? " sel" : "");
      seat.disabled = !ready || Boolean(booked[number]);
      seat.setAttribute(
        "aria-label",
        "Place " + number + " : " + (booked[number] ? "réservée" : selected.has(number) ? "sélectionnée" : "libre")
      );
    });

    const reservedCount = Object.keys(booked).length;
    document.getElementById("nRes").textContent = reservedCount;
    document.getElementById("nSel").textContent = selected.size;
    document.getElementById("nFree").textContent = Math.max(0, 26 - reservedCount - selected.size);
    renderReservations(booked);
  }

  window.BusView = { createBusLayout, renderBusState };
})();
