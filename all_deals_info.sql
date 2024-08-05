select
	SUBSTRING(d.id, 0, 5) as id, 
	d.date,
	dsP.last_name || ', ' || dsP.first_name as salesman,
	p.last_name || ', ' || p.first_name as contact,
	i.make,
	i.model,
	d.cash,
	d.finance,
	d.pmt,
	d.term
from
	deal d
left join deal_salesman ds on
	ds.deal = d.id
left join salesman s on
	s.person = ds.salesman
left join person dsP on
	s.person = dsP.id
join inventory i on
	i.vin = d.inventory
join account a on
	d.account = a.id
join person p on
	p.id = a.contact
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
	contact,
	finance