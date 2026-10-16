/*
    Script to create the design of database & tables.
    -Cloud Computing Consultants
*/

--Database
use master;
go

if exists (select name from master.sys.databases where name='bloom_records')
begin
    drop database bloom_records;
end
else
begin
    create database bloom_records;
end;

--Start creation of tables
begin transaction;

use bloom_records;

--Tables
create table product (
    product_id int not null primary key,
    grade varchar(255),
    rc_number decimal
);
create table contract_type(
    contract_type_id int not null primary key,
    contract_type_desc varchar(255)
);
create table unit_measurement (
    unit_measurement_id int not null primary key,
    unit_measurement_desc char(3)
);
create table trader (
    trader_id int not null primary key,
    trader_name varchar(255)
)
create table warehouse (
    warehouse_id int not null primary key,
    location_desc varchar(255),
    warehouse_rate decimal,
    unit_measurement_id int,
    trader_id int
);
create table contract_details (
    contract_product varchar(255),
    contract_quantity int,
    unit_measurement_id int,
    contract_price decimal
);
create table incoterms (
    incoterms_id int not null primary key,
    incoterms_type varchar(255)
);
create table agent (
    agent_id int not null primary key,
    agent_commission decimal,
    agent_country varchar(255)
);
create table bl_status (
    bl_status_id int not null primary key,
    bl_status_type varchar(255)
);
create table counterparty_type (
    counterparty_type_id int not null primary key,
    counterparty_type_desc varchar(255)
);
create table counterparty (
    counterparty_id int not null primary key,
    counterparty_type_id int,
    counterparty_name varchar(255)
);
create table inventory_status (
    inventory_status_id int not null primary key,
    inventory_status_type varchar(255),
    designation varchar(255)
);
create table inventory_schedule (
    inventory_status_id int,
    product_id int,
    inventory_id int
);
create table schedule (
    warehouse_id int,
    trucker_id int
);
create table trucker (
    trucker_id int not null primary key,
    rate decimal,
    company varchar(255),
    warehouse_id int
);
create table payment_terms (
    payment_terms_id int not null primary key,
    shipment_date datetime,
    payment_terms_type varchar(255)
);
create table inventory (
    inventory_id int not null primary key,
    product_id int,
    warehouse_id int,
    quantity decimal,
    received_date datetime,
    release_date datetime
);
create table bridge_finance (
    inventory_id int,
    cost int
);
create table contract_status (
    contract_status_id int not null primary key,
    contract_status_desc varchar(255)
);
create table lc (
    lc_id int not null primary key,
    lc_number varchar(255),
    product varchar(255),
    unit_measurement_id int,
    quantity decimal,
    lc_price decimal,
    fee decimal,
    lc_date datetime,
    customer varchar(255), --It's counter party
    cutoff datetime,
    eta datetime,
    ets datetime,
    lc_location varchar(255)
);
create table link (
    link_id int not null primary key,
    purchase decimal,
    sale decimal,
    pnl decimal,
    gross decimal,
    fees decimal,
    lc_id int
);
create table bl (
    bl_id int not null primary key,
    bl_status_id int,
    vessel varchar(255),
    booking_number varchar(255),
    port_of_discharge varchar(255),
    port_of_loading varchar(255),
    bl_date datetime
);
create table contract (
    contract_id int not null primary key,
    contract_type_id int,
    contract_date datetime,
    contract_status_id int,
    incoterms_id int,
    payment_terms_id int,
    link_id int,
    counterparty_id int,
    agent_id int,
    bl_id int
);

commit transaction;

--Load Data -> Database

--Constraints

use bloom_records;
go

-- Foreign Keys
begin transaction;

alter table warehouse add foreign key (unit_measurement_id) references unit_measurement(unit_measurement_id);
alter table warehouse add foreign key (trader_id) references trader(trader_id);
alter table contract_details add foreign key (unit_measurement_id) references unit_measurement(unit_measurement_id);
alter table counterparty add foreign key (counterparty_type_id) references counterparty_type(counterparty_type_id);
alter table inventory_schedule add foreign key (inventory_status_id) references inventory_status(inventory_status_id);
alter table inventory_schedule add foreign key (product_id) references product(product_id);
alter table inventory_schedule add foreign key (inventory_id) references inventory(inventory_id);
alter table schedule add foreign key (warehouse_id) references warehouse(warehouse_id);
alter table schedule add foreign key (trucker_id) references trucker(trucker_id);
alter table trucker add foreign key (warehouse_id) references warehouse(warehouse_id);
alter table inventory add foreign key (product_id) references product(product_id);
alter table inventory add foreign key (warehouse_id) references warehouse(warehouse_id);
alter table bl add foreign key (bl_status_id) references bl_status(bl_status_id);
alter table contract add foreign key (contract_type_id) references contract_type(contract_type_id);
alter table contract add foreign key (contract_status_id) references contract_status(contract_status_id);
alter table contract add foreign key (incoterms_id) references incoterms(incoterms_id);
alter table contract add foreign key (payment_terms_id) references payment_terms(payment_terms_id);
alter table contract add foreign key (link_id) references link(link_id);
alter table contract add foreign key (counterparty_id) references counterparty(counterparty_id);
alter table contract add foreign key (agent_id) references agent(agent_id);
alter table contract add foreign key (bl_id) references bl(bl_id);
alter table lc add foreign key (unit_measurement_id) references unit_measurement(unit_measurement_id);
alter table link add foreign key (lc_id) references lc(lc_id);

-- Check Contraints
alter table link add constraint chk_gross check (pnl - fees = gross);
alter table link add constraint chk_pnl check (sale - purchase = pnl);
alter table inventory add constraint chk_quantity check (quantity <= 2000);
alter table inventory add constraint chk_validDateInventory check (received_date < release_date);
alter table lc add constraint chk_validDateLc check (eta > ets);

commit transaction;

--Load Data -> Trigger(s), Function(s), & Procedure(s)
