import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function ProtectedPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateAuth = async () => {
      try {
        const res = await fetch('/api/validate-token', {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          router.push('/login');
          return;
        }

        setLoading(false);
      } catch (error) {
        router.push('/login');
      }
    };

    validateAuth();
  }, [router]);

  if (loading) {
    return <p>Checking authentication...</p>;
  }

  return (
    <div>
      <h1>Protected Page</h1>
      <p>You are logged in!</p>
      <a
                className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                href="./dashboard/billing"
                target="_blank"
                rel="noopener noreferrer"
              >
                
                Go to Billing →
              </a>
    </div>
    
  );
}