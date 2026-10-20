const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const output = path.join(root, "dist");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const tripId = process.env.SUPABASE_TRIP_ID || "bus-1";

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL et SUPABASE_ANON_KEY doivent être configurées.");
}

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(path.join(output, "css"), { recursive: true });
fs.mkdirSync(path.join(output, "js"), { recursive: true });

fs.copyFileSync(
  path.join(root, "reservation-bus.html"),
  path.join(output, "index.html")
);
fs.copyFileSync(
  path.join(root, "css", "reservation-bus.css"),
  path.join(output, "css", "reservation-bus.css")
);

for (const file of ["reservations.js", "bus-view.js", "app.js"]) {
  fs.copyFileSync(path.join(root, "js", file), path.join(output, "js", file));
}

fs.writeFileSync(
  path.join(output, "js", "supabase-config.js"),
  "window.SUPABASE_CONFIG = " +
    JSON.stringify({ url: supabaseUrl, anonKey: supabaseKey, tripId }) +
    ";\n"
);
