import { createClient } from '@supabase/supabase-js';
import { hashPassword } from '../../lib/auth';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

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
      .select('id, email')
      .single();

    if (insertError) {
      throw insertError;
    }

    // New for profiles table. ADD THIS HERE
    const { error: profileError } = await supabase
    .from('profiles')
    .insert([
      {
        user_id: newUser.id,  // MUST match users.id (your current schema)
        email: newUser.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
    
    if (profileError) throw profileError;
    //console.log('profileError:', profileError);


    // new code: 
    // CREATE JWT
    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1000d',
      }
    );


    //SET HTTP-ONLY COOKIE
    const cookie = serialize('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 1000, // 1000 days
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);



    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    console.error('Sign-up error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}