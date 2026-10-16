/*
    Script to create/update the triggers and functions.
    -Cloud Computing Consultants
*/

use bloom_records;
go

begin transaction;
go

--Delete data in child table "contract" after a deletion happened in parent table "agent"

create or alter trigger agent_cascade_delete
on agent
for delete
as
	declare	@agentidtodelete int
	select	@agentidtodelete = agent_id
	from	deleted

	delete from contract
	where  agent_id = @agentidtodelete

go

--Delete data in child table "contract" after a deletion happened in parent table "bl"

create or alter trigger bl_cascade_delete
on bl
for delete
as
	declare	@blidtodelete int
	select	@blidtodelete = bl_id
	from	deleted

	delete from contract
	where  bl_id = @blidtodelete
go

--Delete data in child table "contract" after a deletion happened in parent table "agent"

create or alter trigger incoterms_cascade_delete
on incoterms
for delete
as
	declare	@incotermsidtodelete int
	select	@incotermsidtodelete = incoterms_id
	from	deleted

	delete from contract
	where  incoterms_id = @incotermsidtodelete
go

--Delete data in child table "contract" after a deletion happened in parent table "counterparty"

create or alter trigger counterparty_cascade_delete
on counterparty
for delete
as
	declare	@counterpartyidtodelete int
	select	@counterpartyidtodelete = counterparty_id
	from	deleted

	delete from contract
	where  counterparty_id = @counterpartyidtodelete
go

--Delete data in child table "contract" after a deletion happened in parent table "link"

create or alter trigger link_cascade_delete
on link
for delete
as
	declare	@linkidtodelete int
	select	@linkidtodelete = link_id
	from	deleted

	delete from contract
	where  link_id = @linkidtodelete
go

--Delete data in child table "contract" after a deletion happened in parent table "agent"

create or alter trigger payment_terms_cascade_delete
on payment_terms
for delete
as
	declare	@paymenttermsidtodelete int
	select	@paymenttermsidtodelete = payment_terms_id
	from	deleted

	delete from contract
	where  payment_terms_id = @paymenttermsidtodelete

commit transaction;