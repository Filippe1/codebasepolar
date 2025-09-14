import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ProtectedPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, []);

  return (
    <div>
      <h1>Protected Page</h1>
      <p>You are logged in!</p>
    </div>
  );
}