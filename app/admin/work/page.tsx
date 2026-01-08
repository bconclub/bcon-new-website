'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import { createSupabaseClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface WorkItem {
  id: string;
  client_name: string;
  project_title: string;
  project_type?: string;
  category: 'creative' | 'tech';
  status: 'draft' | 'published';
  featured: boolean;
  created_at: string;
}

export default function WorkAdmin() {
  const router = useRouter();
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchWorkItems();
  }, [selectedCategory]);

  const fetchWorkItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/work?status=all');
      const result = await response.json();
      
      if (result.data) {
        setWorkItems(result.data);
      }
    } catch (error) {
      console.error('Error fetching work items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createSupabaseClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this work item?')) return;

    try {
      const response = await fetch(`/api/work/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchWorkItems();
      }
    } catch (error) {
      console.error('Error deleting work item:', error);
    }
  };

  const filteredItems = selectedCategory === 'all'
    ? workItems
    : workItems.filter(item => item.category === selectedCategory);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Work Management</h1>
              <p className="text-gray-400">Manage your work items and case studies</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/admin/work/new"
                className="bg-[#CDFC2E] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#b8e026] transition-colors"
              >
                + New Work Item
              </Link>
              <Link
                href="/admin"
                className="bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Portfolio
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Filter */}
          <div className="mb-6 flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-lg"
            >
              <option value="all">All Categories</option>
              <option value="creative">Creative</option>
              <option value="tech">Tech</option>
            </select>
            <Link
              href="/admin/work/story-highlights"
              className="bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Manage Story Highlights
            </Link>
          </div>

          {/* Work Items Table */}
          {isLoading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="text-left p-4">Project Title</th>
                    <th className="text-left p-4">Client</th>
                    <th className="text-left p-4">Category</th>
                    <th className="text-left p-4">Type</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Featured</th>
                    <th className="text-left p-4">Created</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center p-8 text-gray-400">
                        No work items found. Create your first work item!
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                        <td className="p-4 font-medium">{item.project_title}</td>
                        <td className="p-4 text-gray-400">{item.client_name}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              item.category === 'creative'
                                ? 'bg-purple-900/30 text-purple-400'
                                : 'bg-cyan-900/30 text-cyan-400'
                            }`}
                          >
                            {item.category}
                          </span>
                        </td>
                        <td className="p-4 text-gray-400">{item.project_type || '-'}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              item.status === 'published'
                                ? 'bg-green-900/30 text-green-400'
                                : 'bg-yellow-900/30 text-yellow-400'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {item.featured ? (
                            <span className="text-[#CDFC2E]">★</span>
                          ) : (
                            <span className="text-gray-600">☆</span>
                          )}
                        </td>
                        <td className="p-4 text-gray-400 text-sm">
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Link
                              href={`/admin/work/edit/${item.id}`}
                              className="text-[#CDFC2E] hover:underline text-sm"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-400 hover:underline text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}



