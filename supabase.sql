create or replace view public.places_occupees as
  select trip_id, seat, nom from public.reservations;

grant select on public.places_occupees to anon;
grant insert on public.reservations to anon;
