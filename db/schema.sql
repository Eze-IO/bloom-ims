-- Bloom IMS: SQLite schema.
-- Ported from the original SQL Server design (original/database/01-schema.sql).
-- Differences from the original:
--   * The six cascade-delete triggers are replaced by ON DELETE CASCADE on contract's foreign keys.
--   * Every other foreign key blocks deletes of rows that are still in use.
--   * Dates are ISO-8601 text, which sorts and compares correctly in SQLite.

PRAGMA foreign_keys = ON;

-- Lookup tables
CREATE TABLE product (
  product_id INTEGER PRIMARY KEY,
  grade      TEXT NOT NULL,
  rc_number  REAL
);
CREATE TABLE contract_type (
  contract_type_id   INTEGER PRIMARY KEY,
  contract_type_desc TEXT NOT NULL
);
CREATE TABLE unit_measurement (
  unit_measurement_id   INTEGER PRIMARY KEY,
  unit_measurement_desc TEXT NOT NULL
);
CREATE TABLE trader (
  trader_id   INTEGER PRIMARY KEY,
  trader_name TEXT NOT NULL
);
CREATE TABLE incoterms (
  incoterms_id   INTEGER PRIMARY KEY,
  incoterms_type TEXT NOT NULL
);
CREATE TABLE bl_status (
  bl_status_id   INTEGER PRIMARY KEY,
  bl_status_type TEXT NOT NULL
);
CREATE TABLE counterparty_type (
  counterparty_type_id   INTEGER PRIMARY KEY,
  counterparty_type_desc TEXT NOT NULL
);
CREATE TABLE inventory_status (
  inventory_status_id   INTEGER PRIMARY KEY,
  inventory_status_type TEXT NOT NULL,
  designation           TEXT
);
CREATE TABLE contract_status (
  contract_status_id   INTEGER PRIMARY KEY,
  contract_status_desc TEXT NOT NULL
);

-- Core tables
CREATE TABLE warehouse (
  warehouse_id        INTEGER PRIMARY KEY,
  location_desc       TEXT NOT NULL,
  warehouse_rate      REAL,
  unit_measurement_id INTEGER REFERENCES unit_measurement (unit_measurement_id),
  trader_id           INTEGER REFERENCES trader (trader_id)
);
CREATE TABLE contract_details (
  contract_product    TEXT NOT NULL,
  contract_quantity   REAL,
  unit_measurement_id INTEGER REFERENCES unit_measurement (unit_measurement_id),
  contract_price      REAL
);
CREATE TABLE agent (
  agent_id         INTEGER PRIMARY KEY,
  agent_commission REAL,
  agent_country    TEXT NOT NULL
);
CREATE TABLE counterparty (
  counterparty_id      INTEGER PRIMARY KEY,
  counterparty_type_id INTEGER NOT NULL REFERENCES counterparty_type (counterparty_type_id),
  counterparty_name    TEXT NOT NULL
);
CREATE TABLE inventory (
  inventory_id  INTEGER PRIMARY KEY,
  product_id    INTEGER NOT NULL REFERENCES product (product_id),
  warehouse_id  INTEGER NOT NULL REFERENCES warehouse (warehouse_id),
  quantity      REAL NOT NULL,
  received_date TEXT NOT NULL,
  release_date  TEXT NOT NULL,
  CONSTRAINT chk_quantity CHECK (quantity <= 2000),
  CONSTRAINT chk_validDateInventory CHECK (received_date < release_date)
);
CREATE TABLE inventory_schedule (
  inventory_status_id INTEGER REFERENCES inventory_status (inventory_status_id),
  product_id          INTEGER REFERENCES product (product_id),
  inventory_id        INTEGER NOT NULL REFERENCES inventory (inventory_id)
);
CREATE TABLE trucker (
  trucker_id   INTEGER PRIMARY KEY,
  rate         REAL,
  company      TEXT NOT NULL,
  warehouse_id INTEGER REFERENCES warehouse (warehouse_id)
);
CREATE TABLE schedule (
  warehouse_id INTEGER NOT NULL REFERENCES warehouse (warehouse_id),
  trucker_id   INTEGER NOT NULL REFERENCES trucker (trucker_id)
);
CREATE TABLE payment_terms (
  payment_terms_id   INTEGER PRIMARY KEY,
  shipment_date      TEXT,
  payment_terms_type TEXT NOT NULL
);
CREATE TABLE bridge_finance (
  inventory_id INTEGER REFERENCES inventory (inventory_id),
  cost         REAL
);
CREATE TABLE lc (
  lc_id               INTEGER PRIMARY KEY,
  lc_number           TEXT NOT NULL,
  product             TEXT,
  unit_measurement_id INTEGER REFERENCES unit_measurement (unit_measurement_id),
  quantity            REAL,
  lc_price            REAL,
  fee                 REAL,
  lc_date             TEXT,
  customer            TEXT NOT NULL, -- the counterparty
  cutoff              TEXT,
  eta                 TEXT,
  ets                 TEXT,
  lc_location         TEXT,
  CONSTRAINT chk_validDateLc CHECK (eta > ets)
);
CREATE TABLE link (
  link_id  INTEGER PRIMARY KEY,
  purchase REAL NOT NULL,
  sale     REAL NOT NULL,
  pnl      REAL,
  gross    REAL,
  fees     REAL,
  lc_id    INTEGER REFERENCES lc (lc_id),
  CONSTRAINT chk_pnl CHECK (pnl = sale - purchase),
  CONSTRAINT chk_gross CHECK (gross = pnl - COALESCE(fees, 0))
);
CREATE TABLE bl (
  bl_id             INTEGER PRIMARY KEY,
  bl_status_id      INTEGER REFERENCES bl_status (bl_status_id),
  vessel            TEXT NOT NULL,
  booking_number    TEXT NOT NULL,
  port_of_discharge TEXT,
  port_of_loading   TEXT,
  bl_date           TEXT
);
CREATE TABLE contract (
  contract_id        INTEGER PRIMARY KEY,
  contract_type_id   INTEGER REFERENCES contract_type (contract_type_id),
  contract_date      TEXT NOT NULL,
  contract_status_id INTEGER NOT NULL REFERENCES contract_status (contract_status_id),
  -- These six cascades replace the original *_cascade_delete triggers.
  incoterms_id       INTEGER REFERENCES incoterms (incoterms_id) ON DELETE CASCADE,
  payment_terms_id   INTEGER REFERENCES payment_terms (payment_terms_id) ON DELETE CASCADE,
  link_id            INTEGER REFERENCES link (link_id) ON DELETE CASCADE,
  counterparty_id    INTEGER NOT NULL REFERENCES counterparty (counterparty_id) ON DELETE CASCADE,
  agent_id           INTEGER REFERENCES agent (agent_id) ON DELETE CASCADE,
  bl_id              INTEGER REFERENCES bl (bl_id) ON DELETE CASCADE
);

-- App users (the original used Amazon Cognito user pools)
CREATE TABLE app_user (
  email     TEXT PRIMARY KEY,
  name      TEXT NOT NULL,
  role      TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
  confirmed INTEGER NOT NULL DEFAULT 0 CHECK (confirmed IN (0, 1))
);

-- Indexes on foreign keys the app joins and filters on
CREATE INDEX idx_contract_counterparty ON contract (counterparty_id);
CREATE INDEX idx_contract_agent ON contract (agent_id);
CREATE INDEX idx_contract_bl ON contract (bl_id);
CREATE INDEX idx_contract_link ON contract (link_id);
CREATE INDEX idx_contract_payment_terms ON contract (payment_terms_id);
CREATE INDEX idx_contract_incoterms ON contract (incoterms_id);
CREATE INDEX idx_inventory_warehouse ON inventory (warehouse_id);
CREATE INDEX idx_inventory_product ON inventory (product_id);
