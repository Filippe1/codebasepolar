export default function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    // If using cookies, clear the token cookie
    res.setHeader('Set-Cookie', 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly');
  
    res.status(200).json({ message: 'Logout successful' });
  }