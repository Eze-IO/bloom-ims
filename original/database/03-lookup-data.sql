/*
    Script to insert data to status & type tables.
    -Cloud Computing Consultants
*/

begin transaction;

use harborline_records;
go

-- trader
insert into trader(trader_id, trader_name)
values (1, 'Dana Whitfield');
insert into trader(trader_id, trader_name)
values (2, 'Marco Ilves');
insert into trader(trader_id, trader_name)
values (3, 'Priya Nandakumar');

-- warehouse
insert into warehouse(warehouse_id, location_desc, warehouse_rate, unit_measurement_id, trader_id)
values (1, 'Bayport Logistics Hub', 0.55, 1, 2);
insert into warehouse(warehouse_id, location_desc, warehouse_rate, unit_measurement_id, trader_id)
values (2, 'Delta Bulk Terminal', 0.32, 1, 2);
insert into warehouse(warehouse_id, location_desc, warehouse_rate, unit_measurement_id, trader_id)
values (3, 'Ridgeline Distribution', 0.32, 1, 1);
insert into warehouse(warehouse_id, location_desc, warehouse_rate, unit_measurement_id, trader_id)
values (4, 'Gulf Coast Storage', 0.45, 1, 3);
insert into warehouse(warehouse_id, location_desc, warehouse_rate, unit_measurement_id, trader_id)
values (5, 'Northgate Freight Center', 0.62, 1, 1);

-- product
insert into product(product_id, grade, rc_number)
values (1, 'HDPE 225', 5);
insert into product(product_id, grade, rc_number)
values (2, 'HDPE 950-EF', 8);
insert into product(product_id, grade, rc_number)
values (3, 'LLDPE', 3);
insert into product(product_id, grade, rc_number)
values (4, 'LLDPE', 6);
insert into product(product_id, grade, rc_number)
values (5, 'HDPE 225', 1);

-- contract_type
insert into contract_type(contract_type_id, contract_type_desc)
values (1, 'purchase');
insert into contract_type(contract_type_id, contract_type_desc)
values (2, 'sell');

-- unit_measurement
insert into unit_measurement(unit_measurement_id, unit_measurement_desc)
values (1, 'mt');
insert into unit_measurement(unit_measurement_id, unit_measurement_desc)
values (2, 'kg');
insert into unit_measurement(unit_measurement_id, unit_measurement_desc)
values (3, 'lbs');

-- incoterms
insert into incoterms(incoterms_id, incoterms_type)
values (1, 'FAS');
insert into incoterms(incoterms_id, incoterms_type)
values (2, 'CFR');
insert into incoterms(incoterms_id, incoterms_type)
values (3, 'CIF');
insert into incoterms(incoterms_id, incoterms_type)
values (4, 'FOB');

-- bl_status
insert into bl_status(bl_status_id, bl_status_type)
values (1, 'incoming');
insert into bl_status(bl_status_id, bl_status_type)
values (2, 'revised');
insert into bl_status(bl_status_id, bl_status_type)
values (3, 'finalized');
insert into bl_status(bl_status_id, bl_status_type)
values (4, 'arrived');

--contract_status
insert into contract_status(contract_status_id, contract_status_desc)
values (1, 'initial');
insert into contract_status(contract_status_id, contract_status_desc)
values (2, 'revised');
insert into contract_status(contract_status_id, contract_status_desc)
values (3, 'complete');

-- counterparty_type
insert into counterparty_type(counterparty_type_id, counterparty_type_desc)
values (1, 'buyer');
insert into counterparty_type(counterparty_type_id, counterparty_type_desc)
values (2, 'seller');

-- inventory_status
insert into inventory_status(inventory_status_id, inventory_status_type, designation)
values (1, 'unpackaged', 'future inventory');
insert into inventory_status(inventory_status_id, inventory_status_type, designation)
values (2, 'packaged', 'sitting');

commit transaction;
