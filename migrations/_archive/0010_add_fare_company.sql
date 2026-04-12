-- Add fare and company to transport_legs and activities
-- fare: actual or estimated price (text to allow ranges like "~€80-200" or exact "€36")
-- company: service provider (airline, railway, tour operator, museum, etc.)

ALTER TABLE transport_legs ADD COLUMN fare    TEXT;
ALTER TABLE transport_legs ADD COLUMN company TEXT;

ALTER TABLE activities ADD COLUMN fare    TEXT;
ALTER TABLE activities ADD COLUMN company TEXT;

-- ── transport_legs — known values ────────────────────────────────────────────

-- Vuelo ida SCL→MAD (IB, tarifa desconocida — ya pagado)
UPDATE transport_legs SET company = 'Iberia'
  WHERE id = 'leg-scl-mad';

-- Vuelo vuelta FCO→MAD IB0656
UPDATE transport_legs SET company = 'Iberia'
  WHERE id = 'leg-fco-mad';

-- Vuelo vuelta MAD→EZE IB0105
UPDATE transport_legs SET company = 'Iberia'
  WHERE id = 'leg-mad-eze';

-- AVE Madrid→Barcelona (Renfe o Ouigo — por confirmar)
UPDATE transport_legs SET company = 'Renfe / Ouigo'
  WHERE id = 'leg-mad-bcn';

-- Frecciarossa Venecia→Roma (Trenitalia)
UPDATE transport_legs SET company = 'Trenitalia'
  WHERE id = 'leg-vce-rom';

-- ── activities — known values ─────────────────────────────────────────────────

-- Sagrada Família — ticket confirmado
UPDATE activities SET fare = '~€36 pp', company = 'Basílica de la Sagrada Família'
  WHERE id = 'bcn-act-apr27-sf';
