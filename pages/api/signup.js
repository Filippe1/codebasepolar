import { createClient } from '@supabase/supabase-js';
import { hashPassword } from '../../lib/auth';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const { data: existingUser, error: queryError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert the new user into the database
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          email,
          password_hash: hashedPassword,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .single();

    if (insertError) {
      throw insertError;
    }

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    console.error('Sign-up error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}