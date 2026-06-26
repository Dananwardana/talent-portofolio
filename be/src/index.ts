import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createClient } from '@supabase/supabase-js';

const app = new Hono();

// Konfigurasi Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_KEY! // Gunakan service key di backend untuk akses admin
);

app.use('/*', cors());

// 1. Endpoint untuk mengambil semua kandidat
app.get('/api/candidates', async (c) => {
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

// 2. Endpoint untuk registrasi
app.post('/api/register', async (c) => {
  const { fullName, email, password, avatarUrl } = await c.req.json();
  
  // Auth Supabase
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return c.json({ error: error.message }, 400);

  // Simpan data profil ke tabel 'profiles'
  const { error: profileError } = await supabase.from('profiles').insert([{ 
    id: data.user?.id, 
    full_name: fullName,
    avatar_url: avatarUrl // Menyimpan URL dari Supabase Storage
  }]);

  if (profileError) return c.json({ error: profileError.message }, 500);
  
  return c.json({ message: "Registrasi sukses!" });
});

// 3. Endpoint untuk ambil detail kandidat by ID
app.get('/api/candidates/:id', async (c) => {
  const id = c.req.param('id');
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (error) return c.json({ error: "Candidate not found" }, 404);
  return c.json(data);
});

const port = 3001;
serve({ fetch: app.fetch, port });
console.log(`Backend running on port ${port}`);