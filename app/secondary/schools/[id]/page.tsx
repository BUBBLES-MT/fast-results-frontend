'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SchoolDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    fetchSchool();
  }, []);

  const fetchSchool = async () => {
    const res = await api.get(`/schools/${id}`);
    setName(res.data.name);
    setLocation(res.data.location);
  };

  const updateSchool = async () => {
    await api.put(`/schools/${id}`, { name, location });
    alert('Updated!');
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">Edit School</h1>

      <Input value={name} onChange={(e) => setName(e.target.value)} />
      <Input value={location} onChange={(e) => setLocation(e.target.value)} />

      <Button onClick={updateSchool}>Update</Button>
      <Button variant="outline" onClick={() => router.push('/schools')}>
        Back
      </Button>
    </div>
  );
}