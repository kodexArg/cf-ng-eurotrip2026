-- 0061: Desconfirmar metros/tube/city-tour no pre-comprados

-- Madrid metros (pay-as-you-go, no confirmables)
UPDATE events SET confirmed = 0 WHERE id = 'ev-leg-mad-t4-sol-arrival';
UPDATE events SET confirmed = 0 WHERE id = 'ev-leg-mad-sol-atocha';

-- London Tube (pay-as-you-go con Oyster/contactless, no confirmables)
UPDATE events SET confirmed = 0 WHERE id = 'ev-leg-lon-victoria-kings-cross';
UPDATE events SET confirmed = 0 WHERE id = 'ev-leg-lon-kx-minalima';
UPDATE events SET confirmed = 0 WHERE id = 'ev-leg-lon-minalima-skygarden';
UPDATE events SET confirmed = 0 WHERE id = 'ev-leg-lon-skygarden-abba';
UPDATE events SET confirmed = 0 WHERE id = 'ev-leg-lon-abba-kx';

-- City tour a pie Londres (free walking / self-guided, no confirmable)
UPDATE events SET confirmed = 0 WHERE id = 'ev-lon-may02-citytour';
