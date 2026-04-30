--
-- PostgreSQL database dump
--

\restrict C0byWWNfKlO2JpPfLEsk0gBHaw4cZv4E1776oE8hTueK0lDP1fS3alZ51bPHQXH

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.9 (Ubuntu 17.9-1.pgdg24.04+1)

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "public";


--
-- Name: SCHEMA "public"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA "public" IS 'standard public schema';


--
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE "public"."PaymentMethod" AS ENUM (
    'CASH',
    'QRIS',
    'TRANSFER'
);


SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: Category; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."Category" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Category_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."Category_id_seq" OWNED BY "public"."Category"."id";


--
-- Name: Product; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."Product" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "price" numeric(10,2) NOT NULL,
    "image" "text",
    "isAvailable" boolean DEFAULT true NOT NULL,
    "categoryId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: StoreConfig; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."StoreConfig" (
    "id" integer DEFAULT 1 NOT NULL,
    "name" "text" DEFAULT 'Mie Jawa Melati'::"text" NOT NULL,
    "address" "text" DEFAULT 'Jl. Nasional III, Blitar'::"text",
    "phone" "text",
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "logoUrl" "text"
);


--
-- Name: Transaction; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."Transaction" (
    "id" "text" NOT NULL,
    "invoiceNumber" "text" NOT NULL,
    "date" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "totalAmount" numeric(12,2) NOT NULL,
    "paymentMethod" "public"."PaymentMethod" DEFAULT 'CASH'::"public"."PaymentMethod" NOT NULL,
    "paidAmount" numeric(12,2) NOT NULL,
    "change" numeric(12,2) NOT NULL,
    "isSynced" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


--
-- Name: TransactionItem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."TransactionItem" (
    "id" "text" NOT NULL,
    "transactionId" "text" NOT NULL,
    "productId" "text" NOT NULL,
    "productName" "text" NOT NULL,
    "quantity" integer NOT NULL,
    "unitPrice" numeric(10,2) NOT NULL,
    "subTotal" numeric(12,2) NOT NULL,
    "note" "text"
);


--
-- Name: Category id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Category" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Category_id_seq"'::"regclass");


--
-- Name: Category Category_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Category"
    ADD CONSTRAINT "Category_name_key" UNIQUE ("name");


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");


--
-- Name: StoreConfig StoreConfig_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."StoreConfig"
    ADD CONSTRAINT "StoreConfig_pkey" PRIMARY KEY ("id");


--
-- Name: TransactionItem TransactionItem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."TransactionItem"
    ADD CONSTRAINT "TransactionItem_pkey" PRIMARY KEY ("id");


--
-- Name: Transaction Transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Transaction"
    ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id");


--
-- Name: Product_categoryId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Product_categoryId_idx" ON "public"."Product" USING "btree" ("categoryId");


--
-- Name: TransactionItem_transactionId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "TransactionItem_transactionId_idx" ON "public"."TransactionItem" USING "btree" ("transactionId");


--
-- Name: Transaction_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Transaction_date_idx" ON "public"."Transaction" USING "btree" ("date");


--
-- Name: Transaction_deletedAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Transaction_deletedAt_idx" ON "public"."Transaction" USING "btree" ("deletedAt");


--
-- Name: Transaction_invoiceNumber_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Transaction_invoiceNumber_key" ON "public"."Transaction" USING "btree" ("invoiceNumber");


--
-- Name: Transaction_isSynced_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Transaction_isSynced_idx" ON "public"."Transaction" USING "btree" ("isSynced");


--
-- Name: Product Product_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."Product"
    ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TransactionItem TransactionItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."TransactionItem"
    ADD CONSTRAINT "TransactionItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TransactionItem TransactionItem_transactionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."TransactionItem"
    ADD CONSTRAINT "TransactionItem_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "public"."Transaction"("id") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Category; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."Category" ENABLE ROW LEVEL SECURITY;

--
-- Name: Transaction Enable read access for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for all users" ON "public"."Transaction" FOR SELECT USING (true);


--
-- Name: TransactionItem Enable read access for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for all users" ON "public"."TransactionItem" FOR SELECT USING (true);


--
-- Name: Product; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."Product" ENABLE ROW LEVEL SECURITY;

--
-- Name: StoreConfig; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."StoreConfig" ENABLE ROW LEVEL SECURITY;

--
-- Name: Transaction; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."Transaction" ENABLE ROW LEVEL SECURITY;

--
-- Name: TransactionItem; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."TransactionItem" ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

\unrestrict C0byWWNfKlO2JpPfLEsk0gBHaw4cZv4E1776oE8hTueK0lDP1fS3alZ51bPHQXH

