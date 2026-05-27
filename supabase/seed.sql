insert into public.regions (name_ko, name_en, province, city, description)
values
  ('서울특별시', 'Seoul', 'Seoul', 'Seoul', 'Capital city food routes with markets, street food, and modern dining.'),
  ('전라북도 전주', 'Jeonju', 'Jeollabuk-do', 'Jeonju', 'Regional food destination known for bibimbap and traditional dining.'),
  ('경상남도 부산', 'Busan', 'Gyeongsangnam-do', 'Busan', 'Coastal city food routes with noodles, seafood, and market destinations.'),
  ('제주특별자치도', 'Jeju', 'Jeju', 'Jeju', 'Island food destination with black pork, seafood, and seasonal produce.')
on conflict (name_ko) do update
set
  name_en = excluded.name_en,
  province = excluded.province,
  city = excluded.city,
  description = excluded.description;

insert into public.foods (region_id, name_ko, name_en, category, description)
select regions.id, foods.name_ko, foods.name_en, foods.category, foods.description
from (
  values
    ('서울특별시', '떡볶이', 'Tteokbokki', 'Street food', 'Spicy rice cakes for market and beginner K-Food routes.'),
    ('전라북도 전주', '전주 비빔밥', 'Jeonju Bibimbap', 'Local classic', 'Rice bowl with seasoned vegetables, gochujang, and local garnish traditions.'),
    ('경상남도 부산', '부산 밀면', 'Busan Milmyeon', 'Noodles', 'Chilled wheat noodle dish associated with Busan food routes.'),
    ('제주특별자치도', '제주 흑돼지', 'Jeju Black Pork', 'Barbecue', 'Jeju specialty linked with barbecue restaurants and travel dining routes.')
) as foods(region_name_ko, name_ko, name_en, category, description)
join public.regions on regions.name_ko = foods.region_name_ko
on conflict (name_ko) do update
set
  region_id = excluded.region_id,
  name_en = excluded.name_en,
  category = excluded.category,
  description = excluded.description,
  is_active = true;

insert into public.places (region_id, name, address, google_place_url, latitude, longitude)
select regions.id, places.name, places.address, places.google_place_url, places.latitude, places.longitude
from (
  values
    ('서울특별시', 'Gwangjang Market', '88 Changgyeonggung-ro, Jongno-gu, Seoul', null, 37.5700, 126.9996),
    ('전라북도 전주', 'Jeonju Hanok Village', '99 Girin-daero, Wansan-gu, Jeonju', null, 35.8151, 127.1530),
    ('경상남도 부산', 'Bupyeong Kkangtong Market', '48 Bupyeong 1-gil, Jung-gu, Busan', null, 35.1015, 129.0260),
    ('제주특별자치도', 'Jeju Dongmun Market', '20 Gwandeok-ro 14-gil, Jeju-si, Jeju', null, 33.5116, 126.5260)
) as places(region_name_ko, name, address, google_place_url, latitude, longitude)
join public.regions on regions.name_ko = places.region_name_ko
where not exists (
  select 1
  from public.places existing_place
  where existing_place.name = places.name
    and existing_place.address is not distinct from places.address
);
