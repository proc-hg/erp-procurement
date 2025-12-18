import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
    });
  }, []);

  async function login() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    } else {
      setUser(data.user);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  async function createPR() {
    const { error } = await supabase.from('purchase_request').insert({
      title,
      amount,
      user_id: user.id,
    });
    if (error) {
      alert(error.message);
    } else {
      alert('PR berhasil dibuat');
      setTitle('');
      setAmount('');
    }
  }

  if (!user) {
    return (
      <div>
        <h2>Login ERP Procurement</h2>
        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Purchase Request</h2>
      <p>User ID: {user.id}</p>

      <input
        placeholder="Judul PR"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <input
        type="number"
        placeholder="Nominal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <br />
      <button onClick={createPR}>Submit PR</button>

      <hr />
      <button onClick={logout}>Logout</button>
    </div>
  );
}
