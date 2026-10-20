# Déploiement sur Vercel

1. Importez le dépôt dans Vercel en gardant sa racine comme répertoire du projet.
2. Dans **Settings > Environment Variables**, ajoutez :
   - `SUPABASE_URL` : l’URL du projet Supabase ;
   - `SUPABASE_ANON_KEY` : sa clé publique anon/publishable ;
   - `SUPABASE_TRIP_ID` : facultatif, `bus-1` par défaut.
3. Déployez. Vercel exécute `npm run build` et publie le dossier `dist`.

La clé anon/publishable est intégrée au JavaScript livré au navigateur : elle n’est
pas un secret. N’utilisez jamais une clé `service_role` ici. Configurez les
permissions et politiques RLS de Supabase pour autoriser uniquement les opérations
publiques nécessaires à l’application. Le script SQL du dépôt accorde les droits
de base utilisés par l’application ; vérifiez aussi les politiques RLS de votre
projet avant la mise en production.
