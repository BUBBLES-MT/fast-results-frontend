'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

export default function StudentDetail() {
  const { id } = useParams();
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    api.get(`/students/${id}`).then(res => setStudent(res.data));
  }, []);

  if (!student) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">
        {student.first_name} {student.last_name}
      </h1>
      <p>Grade: {student.grade}</p>
      <p>Age: {student.age}</p>
    </div>
  );
}