import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import { comparePassword } from '../../lib/auth';
// import { hashPassword } from '../../lib/auth';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;
  
  try {
    // Fetch the user from the database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    
    
    //console.log("SUPABASE ERROR:", error);
    //console.log("USER:", user);

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid credentials other' });
    }

    // Verify the password
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update the last_login timestamp aka updated_at field
    await supabase
      .from('users')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', user.id);
    
    // Create a JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}