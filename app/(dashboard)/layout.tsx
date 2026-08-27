'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const logout = () => {
    localStorage.clear();
    router.replace('/login');
  };

  return (
    <div>
      <nav className="bg-white shadow px-6 py-4 flex justify-between">
        <h1 className="font-bold">SMS System</h1>
        <div className="flex gap-4">
          <Button onClick={() => router.push('/dashboard')}>Dashboard</Button>
          <Button onClick={() => router.push('/students')}>Students</Button>
          <Button onClick={() => router.push('/teachers')}>Teachers</Button>
          <Button onClick={() => router.push('/schools')}>Schools</Button>
          <Button variant="destructive" onClick={logout}>Logout</Button>
        </div>
      </nav>

      <div className="p-4">{children}</div>
    </div>
  );
}