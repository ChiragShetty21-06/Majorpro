import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, CheckCircle, MessageSquare, LogOut, Settings } from 'lucide-react';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);

        if (userData.role !== 'user') {
          navigate('/');
          return;
        }

        loadUserConsultations();
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, []);

  const loadUserConsultations = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/consultations/my-consultations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setConsultations(data.data || []);
      } else {
        setError(data.message || 'Failed to load consultations');
      }
    } catch (err) {
      setError(err.message || 'Failed to load consultations');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'secondary', icon: Clock },
      assigned: { variant: 'default', icon: MessageSquare },
      resolved: { variant: 'outline', icon: CheckCircle },
    };
    const config = statusConfig[status] || { variant: 'default' };
    return config;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const pendingCount = consultations.filter(c => c.status === 'pending').length;
  const assignedCount = consultations.filter(c => c.status === 'assigned').length;
  const resolvedCount = consultations.filter(c => c.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-blue-100 mt-1">Welcome, {user.fullName}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-blue-600"
                onClick={() => navigate('/submit-query')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                New Query
              </Button>
              <Button
                variant="ghost"
                className="text-white hover:bg-blue-700"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Queries</p>
                  <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
                </div>
                <Clock className="w-12 h-12 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Assigned to Lawyer</p>
                  <p className="text-3xl font-bold text-blue-600">{assignedCount}</p>
                </div>
                <MessageSquare className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Resolved</p>
                  <p className="text-3xl font-bold text-green-600">{resolvedCount}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Card */}
        <Card className="mb-8">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle>Profile Information</CardTitle>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Name</p>
                <p className="text-sm font-medium mt-1">{user.fullName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Username</p>
                <p className="text-sm font-medium mt-1">{user.username}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Email</p>
                <p className="text-sm font-medium mt-1">{user.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Role</p>
                <p className="text-sm font-medium mt-1 capitalize">{user.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consultations List */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle>My Legal Consultations</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading your consultations...</p>
              </div>
            ) : consultations.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-600 mb-4">No consultations yet</p>
                <Button onClick={() => navigate('/submit-query')}>
                  Submit Your First Query
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {consultations.map((consultation) => (
                  <div
                    key={consultation._id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {consultation.query?.substring(0, 50)}...
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Submitted: {new Date(consultation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={getStatusBadge(consultation.status).variant}>
                        {consultation.status}
                      </Badge>
                    </div>
                    {consultation.assignedLawyer && (
                      <p className="text-sm text-gray-600 mt-2">
                        Assigned to: <span className="font-medium">{consultation.assignedLawyer.fullName}</span>
                      </p>
                    )}
                    {consultation.response && (
                      <div className="mt-3 p-3 bg-green-50 rounded border border-green-200">
                        <p className="text-xs font-semibold text-green-800 mb-1">Response:</p>
                        <p className="text-sm text-green-900">{consultation.response}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
