import { createClient } from '@supabase/supabase-js';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handle } from 'hono/vercel';

// Inisialisasi Hono
const app = new Hono();

// Konfigurasi Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_KEY! 
);

// Middleware CORS
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

  /* 
     PERINGATAN: 
     Jika kamu sudah menggunakan SQL Trigger di Supabase untuk sinkronisasi profil
     setelah email terverifikasi (seperti yang kita bahas sebelumnya), 
     maka blok .insert di bawah ini HARUS dihapus atau di-comment 
     agar tidak terjadi bentrok atau data ganda.
  */
  const { error: profileError } = await supabase.from('profiles').insert([{ 
    id: data.user?.id, 
    full_name: fullName,
    avatar_url: avatarUrl
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

// Export handler khusus untuk Vercel
export default handle(app);