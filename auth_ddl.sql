
create database user_auth
    with owner postgres;

create table public.app
(
    id   text default gen_random_uuid() not null
        constraint app_pk
            primary key,
    name text                           not null
);

alter table public.app
    owner to postgres;

create unique index app__index
    on public.app (name);

create table public.auth_source
(
    id         text default gen_random_uuid()                                            not null
        constraint auth_source_pk
            primary key,
    source     text                                                                      not null,
    date_added text default (round((EXTRACT(epoch FROM now()) * (1000)::numeric)))::text not null
);

alter table public.auth_source
    owner to postgres;

create unique index auth_source_source_uindex
    on public.auth_source (source);

create table public.auth_user
(
    id   text default gen_random_uuid() not null
        constraint auth_user_pk
            primary key,
    name text                           not null
);

alter table public.auth_user
    owner to postgres;

create table public.membership
(
    id         text default gen_random_uuid()                                            not null
        constraint user_group_pk
            primary key,
    name       text                                                                      not null,
    date_added text default (round((EXTRACT(epoch FROM now()) * (1000)::numeric)))::text not null,
    source     text default 'entra'::text                                                not null
        constraint membership_auth_source_source_fk
            references public.auth_source ()
            on update cascade on delete cascade
);

alter table public.membership
    owner to postgres;

create table public.app_membership_route
(
    id         text default gen_random_uuid() not null
        constraint app_membership_route_pk
            primary key,
    membership text                           not null
        constraint app_membership_route_membership_name_fk
            references public.membership ()
            on update cascade on delete cascade,
    app        text                           not null
        constraint app_membership_route_app_name_fk
            references public.app ()
            on update cascade on delete cascade,
    route      text,
    access     text default 'user'::text
);

alter table public.app_membership_route
    owner to postgres;

create unique index app_membership_route_membership_app_route_uindex
    on public.app_membership_route (membership, app, route);

create unique index membership_name_uindex
    on public.membership (name);

create table public.profile
(
    id              text default gen_random_uuid() not null
        constraint profile_pk
            primary key,
    username        text                           not null,
    email_primary   text,
    email_secondary text,
    phone_number    text,
    title           text,
    full_name       text,
    first_name      text,
    last_name       text,
    user_id         text                           not null
        constraint profile_auth_user_id_fk
            references public.auth_user
            on update cascade on delete cascade
);

alter table public.profile
    owner to postgres;

create unique index profile_username_uindex
    on public.profile (username);

create table public.user_id
(
    id        text default gen_random_uuid() not null
        constraint user_id_pk
            primary key,
    source_id text
        constraint user_id_auth_source_source_fk
            references public.auth_source ()
            on update cascade on delete cascade,
    value     text                           not null,
    user_id   text
        constraint user_id_auth_user_id_fk
            references public.auth_user
            on update cascade on delete cascade
);

alter table public.user_id
    owner to postgres;

create unique index user_id_source_id_value_uindex
    on public.user_id (source_id, value);

create table public.user_key
(
    id              text default gen_random_uuid() not null
        constraint user_key_pk
            primary key,
    user_id         text                           not null
        constraint user_key_auth_user_id_fk
            references public.auth_user
            on update cascade on delete cascade,
    hashed_password text
);

alter table public.user_key
    owner to postgres;

create table public.user_membership
(
    id         text default gen_random_uuid() not null
        constraint user_membership_pk
            primary key,
    membership text                           not null
        constraint user_membership_membership_name_fk
            references public.membership ()
            on update cascade on delete cascade,
    user_id    text                           not null
        constraint user_membership_auth_user_id_fk
            references public.auth_user
            on update cascade on delete cascade
);

alter table public.user_membership
    owner to postgres;

create unique index user_membership_membership_user_id_uindex
    on public.user_membership (membership, user_id);

create table public.user_session
(
    id         text default gen_random_uuid() not null
        constraint user_session_pk
            primary key,
    user_id    text                           not null
        constraint user_session_user_id_fk
            references public.auth_user
            on update cascade on delete cascade,
    app        text                           not null
        constraint user_session_app_name_fk
            references public.app ()
            on update cascade on delete cascade,
    expires_at timestamp with time zone       not null
);

alter table public.user_session
    owner to postgres;

