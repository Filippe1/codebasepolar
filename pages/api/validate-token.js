import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const token = req.cookies.auth_token;
  // we use cookies now
  if (!token) {
    return res.status(401).json({
      message: 'No authentication token found',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      message: 'Token valid',
      user: {
        userId: decoded.userId,
        email: decoded.email,
      },
    });
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token',
    });
  }
}