// app/pages/past-papers/index.tsx
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Plus, Search, Filter } from 'lucide-react';

export default function PastPapersList() {
  const router = useRouter();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Get user role from localStorage or context
    const role = localStorage.getItem('userRole') || '';
    setUserRole(role);
    loadPapers();
  }, []);

  const loadPapers = async () => {
    try {
      const response = await api.get('/past-papers');
      setPapers(response.data || []);
    } catch (error) {
      console.error('Failed to load papers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if user can add papers (teachers and admins)
  const canAddPapers = ['teacher', 'admin', 'superadmin', 'Academic', 'Headmaster'].includes(userRole);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📚 Past Papers</h1>
          <p className="text-gray-500 text-sm">Browse and download past examination papers</p>
        </div>
        
        {/* 🔥 ADD BUTTON - Only visible to teachers and admins */}
        {canAddPapers && (
          <Link 
            href="/past-papers/add"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow"
          >
            <Plus className="w-5 h-5" />
            <span>Add Past Paper</span>
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by subject, title, or year..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Papers List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : papers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-lg font-semibold text-gray-700">No Past Papers Found</h3>
          <p className="text-gray-500 mt-1">Upload past papers to help students prepare</p>
          {canAddPapers && (
            <Link 
              href="/past-papers/add"
              className="inline-block mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Upload First Paper
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {papers.map((paper: any) => (
            <div key={paper.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-800 truncate">{paper.title}</h3>
              <p className="text-sm text-gray-500">{paper.subject} • {paper.year}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{paper.exam_type}</span>
                <button 
                  onClick={() => window.open(`/api/v1/past-papers/${paper.id}/download`, '_blank')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}