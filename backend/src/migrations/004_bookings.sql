CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  trip_id UUID REFERENCES trips(id),
  type TEXT NOT NULL,
  provider TEXT,
  status TEXT DEFAULT 'saved',
  item_name TEXT NOT NULL,
  item_data JSONB NOT NULL,
  price_amount NUMERIC(12,2),
  price_currency TEXT DEFAULT 'USD',
  check_in DATE,
  check_out DATE,
  confirmation_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY bookings_self ON bookings
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE TABLE price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  trip_id UUID REFERENCES trips(id),
  type TEXT NOT NULL,
  item_name TEXT NOT NULL,
  item_snapshot JSONB NOT NULL,
  target_price NUMERIC(12,2),
  current_price NUMERIC(12,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY alerts_self ON price_alerts
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
