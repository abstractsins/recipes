--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'user',
    'admin'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- Name: TagType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TagType" AS ENUM (
    'recipe',
    'ingredient'
);


ALTER TYPE public."TagType" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Ingredient; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Ingredient" (
    id integer NOT NULL,
    name text NOT NULL,
    main text,
    variety text,
    category text,
    subcategory text,
    seasons text[],
    notes text,
    "userId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Ingredient" OWNER TO postgres;

--
-- Name: Ingredient_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Ingredient_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Ingredient_id_seq" OWNER TO postgres;

--
-- Name: Ingredient_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Ingredient_id_seq" OWNED BY public."Ingredient".id;


--
-- Name: Recipe; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Recipe" (
    id integer NOT NULL,
    name text NOT NULL,
    "userId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Recipe" OWNER TO postgres;

--
-- Name: RecipeIngredient; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RecipeIngredient" (
    id integer NOT NULL,
    "recipeId" integer NOT NULL,
    "ingredientId" integer NOT NULL,
    quantity text NOT NULL,
    "prepMethod" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    unit text NOT NULL
);


ALTER TABLE public."RecipeIngredient" OWNER TO postgres;

--
-- Name: RecipeIngredient_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."RecipeIngredient_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."RecipeIngredient_id_seq" OWNER TO postgres;

--
-- Name: RecipeIngredient_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."RecipeIngredient_id_seq" OWNED BY public."RecipeIngredient".id;


--
-- Name: Recipe_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Recipe_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Recipe_id_seq" OWNER TO postgres;

--
-- Name: Recipe_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Recipe_id_seq" OWNED BY public."Recipe".id;


--
-- Name: Tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Tag" (
    id integer NOT NULL,
    name text NOT NULL,
    type public."TagType" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdBy" integer
);


ALTER TABLE public."Tag" OWNER TO postgres;

--
-- Name: Tag_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Tag_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Tag_id_seq" OWNER TO postgres;

--
-- Name: Tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Tag_id_seq" OWNED BY public."Tag".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    nickname text,
    "lastLogin" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    role public."Role" DEFAULT 'user'::public."Role" NOT NULL,
    username text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _IngredientTags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_IngredientTags" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_IngredientTags" OWNER TO postgres;

--
-- Name: _RecipeTags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."_RecipeTags" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);


ALTER TABLE public."_RecipeTags" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: Ingredient id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ingredient" ALTER COLUMN id SET DEFAULT nextval('public."Ingredient_id_seq"'::regclass);


--
-- Name: Recipe id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Recipe" ALTER COLUMN id SET DEFAULT nextval('public."Recipe_id_seq"'::regclass);


--
-- Name: RecipeIngredient id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RecipeIngredient" ALTER COLUMN id SET DEFAULT nextval('public."RecipeIngredient_id_seq"'::regclass);


--
-- Name: Tag id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tag" ALTER COLUMN id SET DEFAULT nextval('public."Tag_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Ingredient; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Ingredient" (id, name, main, variety, category, subcategory, seasons, notes, "userId", "createdAt", "updatedAt") FROM stdin;
1	Ground Beef 90/10	beef	ground, 90/10	meat	beef	\N	\N	1	2025-06-09 21:38:42.625	2025-06-09 21:38:42.625
2	White Onion	onion	white	vegetable	root	\N	\N	1	2025-06-09 21:38:42.63	2025-06-09 21:38:42.63
3	Large Egg	egg	large	\N	\N	\N	\N	1	2025-06-09 21:38:42.632	2025-06-09 21:38:42.632
4	Sage	\N	\N	herb	\N	\N	\N	1	2025-06-09 21:38:42.634	2025-06-09 21:38:42.634
5	Carrot	carrot	\N	vegetable	root	\N	\N	1	2025-06-09 21:38:42.636	2025-06-09 21:38:42.636
6	milk	main	whole	dairy	\N	\N	\N	1	2025-06-09 21:38:42.638	2025-06-09 21:38:42.638
7	Carrot	carrot	\N	vegetable	root	\N	\N	2	2025-06-09 21:38:42.64	2025-06-09 21:38:42.64
8	milk	main	whole	dairy	\N	\N	\N	2	2025-06-09 21:38:42.642	2025-06-09 21:38:42.642
9	Carrot	carrot	\N	vegetable	root	\N	\N	3	2025-06-09 21:38:42.643	2025-06-09 21:38:42.643
10	milk	main	whole	dairy	\N	\N	\N	3	2025-06-09 21:38:42.644	2025-06-09 21:38:42.644
\.


--
-- Data for Name: Recipe; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Recipe" (id, name, "userId", "createdAt", "updatedAt") FROM stdin;
2	Meatloaf	2	2025-06-09 21:38:42.652	2025-06-09 21:38:42.652
1	Basic Meatloaf	1	2025-06-09 21:38:42.645	2025-06-09 21:38:42.645
\.


--
-- Data for Name: RecipeIngredient; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RecipeIngredient" (id, "recipeId", "ingredientId", quantity, "prepMethod", "createdAt", "updatedAt", unit) FROM stdin;
1	1	1	2	\N	2025-06-11 04:45:31.784	2025-06-11 04:45:31.784	lbs
2	1	2	0.5	chopped	2025-06-11 04:45:31.784	2025-06-11 04:45:31.784	cup
\.


--
-- Data for Name: Tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tag" (id, name, type, "createdAt", "updatedAt", "createdBy") FROM stdin;
1	frozen	ingredient	2025-06-09 21:38:42.608	2025-06-09 21:38:42.608	\N
2	spicy	ingredient	2025-06-09 21:38:42.61	2025-06-09 21:38:42.61	\N
3	dried	ingredient	2025-06-09 21:38:42.611	2025-06-09 21:38:42.611	\N
4	canned	ingredient	2025-06-09 21:38:42.612	2025-06-09 21:38:42.612	\N
5	spicy	recipe	2025-06-09 21:38:42.612	2025-06-09 21:38:42.612	\N
6	quick	recipe	2025-06-09 21:38:42.613	2025-06-09 21:38:42.613	\N
7	fried	recipe	2025-06-09 21:38:42.614	2025-06-09 21:38:42.614	\N
8	one pot	recipe	2025-06-09 21:38:42.615	2025-06-09 21:38:42.615	\N
9	Jewish	recipe	2025-06-09 21:38:42.616	2025-06-09 21:38:42.616	1
10	freezable	recipe	2025-06-09 21:38:42.617	2025-06-09 21:38:42.617	1
11	freezable	recipe	2025-06-09 21:38:42.618	2025-06-09 21:38:42.618	3
12	make ahead	recipe	2025-06-09 21:38:42.619	2025-06-09 21:38:42.619	3
13	very dairy	recipe	2025-06-09 21:38:42.619	2025-06-09 21:38:42.619	2
14	Amber approved	recipe	2025-06-09 21:38:42.62	2025-06-09 21:38:42.62	2
15	expensive	ingredient	2025-06-09 21:38:42.621	2025-06-09 21:38:42.621	1
16	get at WF	ingredient	2025-06-09 21:38:42.622	2025-06-09 21:38:42.622	2
17	better fresh	ingredient	2025-06-09 21:38:42.623	2025-06-09 21:38:42.623	3
18	better canned	ingredient	2025-06-09 21:38:42.624	2025-06-09 21:38:42.624	3
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, password, nickname, "lastLogin", "createdAt", "updatedAt", role, username) FROM stdin;
2	fake1@fake.com	$2b$10$T6W2InRUZ.ldhb.SJQQrGuLKgGSNMk1CbI4inf3XIXv5Qw82i0/fC	Test User 1	\N	2025-06-09 21:38:42.549	2025-06-09 21:38:42.549	user	fake1
3	fake2@fake.com	$2b$10$YKFmDAPon1KSa8hb7Gw6h.uM8CEbxABS71R5BNkOe6OdtQ3tuRGJS	Test User 2	\N	2025-06-09 21:38:42.606	2025-06-09 21:38:42.606	user	fake2
1	dan	$2b$10$k3dg4m8adDUV4.uWmpgQ3e7w0sgf62693vavBW./EkzDr/7bYASqK	superUser	\N	2025-06-09 21:38:42.475	2025-06-09 21:38:42.654	admin	abstractsins
\.


--
-- Data for Name: _IngredientTags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_IngredientTags" ("A", "B") FROM stdin;
1	1
2	1
3	1
4	1
5	1
6	1
7	1
8	1
9	1
10	1
\.


--
-- Data for Name: _RecipeTags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."_RecipeTags" ("A", "B") FROM stdin;
1	6
2	6
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
7cdaf5e2-2fa7-4510-9407-9bb0a582a5b7	c162315976e12bfa8a7f5e158cd7473af5ea2f5e9fa0f9488b523e491d77df86	2025-06-09 17:38:40.226064-04	20250606185111_init	\N	\N	2025-06-09 17:38:40.220474-04	1
a3fd448a-ada8-4256-a24b-b7ca0ffadc6e	f6af4418eb3244bba819c915afa02e5de36470eb151625478c88cd81af4bb380	2025-06-09 17:38:40.247428-04	20250609182258_add_username_to_user	\N	\N	2025-06-09 17:38:40.226631-04	1
0e39eb41-1eb1-4a78-aa1b-5184492f2db6	833b7a6cd61e622000c443e59a3591d2c2586203ab7abb40159d2a8d80fae81d	2025-06-09 17:38:40.251177-04	20250609195241_add_tag_users	\N	\N	2025-06-09 17:38:40.24773-04	1
79a74293-5a7e-469a-b740-91f669546bb0	432a558462b426b6578ef4a2f590e95e37aa26ca454253c76567b663ef587733	2025-06-11 00:23:09.940117-04	20250611042309_add_recipe_ingredient_join	\N	\N	2025-06-11 00:23:09.91495-04	1
932cbd7a-29e0-4ff8-af6b-ef33d7253d12	c557e83e13fc04d787a8ea3679a862c9ecd29a19d5be500dd9c6f99c314cc46f	2025-06-11 00:40:14.318234-04	20250611044013_recipe_ingredient_join_edit	\N	\N	2025-06-11 00:40:14.315887-04	1
\.


--
-- Name: Ingredient_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Ingredient_id_seq"', 10, true);


--
-- Name: RecipeIngredient_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."RecipeIngredient_id_seq"', 2, true);


--
-- Name: Recipe_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Recipe_id_seq"', 2, true);


--
-- Name: Tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Tag_id_seq"', 18, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 3, true);


--
-- Name: Ingredient Ingredient_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ingredient"
    ADD CONSTRAINT "Ingredient_pkey" PRIMARY KEY (id);


--
-- Name: RecipeIngredient RecipeIngredient_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RecipeIngredient"
    ADD CONSTRAINT "RecipeIngredient_pkey" PRIMARY KEY (id);


--
-- Name: Recipe Recipe_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Recipe"
    ADD CONSTRAINT "Recipe_pkey" PRIMARY KEY (id);


--
-- Name: Tag Tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _IngredientTags _IngredientTags_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_IngredientTags"
    ADD CONSTRAINT "_IngredientTags_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _RecipeTags _RecipeTags_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_RecipeTags"
    ADD CONSTRAINT "_RecipeTags_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Ingredient_userId_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Ingredient_userId_name_key" ON public."Ingredient" USING btree ("userId", name);


--
-- Name: RecipeIngredient_recipeId_ingredientId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "RecipeIngredient_recipeId_ingredientId_key" ON public."RecipeIngredient" USING btree ("recipeId", "ingredientId");


--
-- Name: Recipe_userId_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Recipe_userId_name_key" ON public."Recipe" USING btree ("userId", name);


--
-- Name: Tag_name_type_createdBy_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Tag_name_type_createdBy_key" ON public."Tag" USING btree (name, type, "createdBy");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: _IngredientTags_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_IngredientTags_B_index" ON public."_IngredientTags" USING btree ("B");


--
-- Name: _RecipeTags_B_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "_RecipeTags_B_index" ON public."_RecipeTags" USING btree ("B");


--
-- Name: Ingredient Ingredient_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Ingredient"
    ADD CONSTRAINT "Ingredient_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RecipeIngredient RecipeIngredient_ingredientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RecipeIngredient"
    ADD CONSTRAINT "RecipeIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES public."Ingredient"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RecipeIngredient RecipeIngredient_recipeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RecipeIngredient"
    ADD CONSTRAINT "RecipeIngredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES public."Recipe"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Recipe Recipe_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Recipe"
    ADD CONSTRAINT "Recipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Tag Tag_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Tag_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: _IngredientTags _IngredientTags_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_IngredientTags"
    ADD CONSTRAINT "_IngredientTags_A_fkey" FOREIGN KEY ("A") REFERENCES public."Ingredient"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _IngredientTags _IngredientTags_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_IngredientTags"
    ADD CONSTRAINT "_IngredientTags_B_fkey" FOREIGN KEY ("B") REFERENCES public."Tag"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _RecipeTags _RecipeTags_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_RecipeTags"
    ADD CONSTRAINT "_RecipeTags_A_fkey" FOREIGN KEY ("A") REFERENCES public."Recipe"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _RecipeTags _RecipeTags_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."_RecipeTags"
    ADD CONSTRAINT "_RecipeTags_B_fkey" FOREIGN KEY ("B") REFERENCES public."Tag"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

