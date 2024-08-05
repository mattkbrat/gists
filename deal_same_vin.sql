select
	SUBSTRING(d.id, 0, 5) as id, 
	SUBSTRING(d.date, 0, 11) as date, 
	p.last_name || ', ' || p.first_name as contact,
	ct.inventory,
	i.make,
	i.model,
	d.pmt,
	d.term
from
	deal d
join inventory i on
	i.vin = d.inventory
join account a on
	d.account = a.id
join person p on
	p.id = a.contact
join (
	select
		count(inventory) ct,
		d.inventory,
		d.id
	from
		deal d
	group by
		inventory
	having
		count(inventory) > 1
	) ct
	on
	ct.inventory = d.inventory
where
	d.id in (
	select
		d.id
	from
		deal d
	order by
		d.date DESC
)
order by
	ct.inventory,
	d.date DESC