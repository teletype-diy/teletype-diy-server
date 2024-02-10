create table portals (id uuid, host_peer_id varchar(120), PRIMARY KEY(ID));


create table events (name varchar(120), user_id varchar(120), portal_id uuid, created_at timestamp);
