import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, CheckCircle, FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function LawyerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pendingConsultations, setPendingConsultations] = useState([]);
  const [assignedConsultations, setAssignedConsultations] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);

        if (userData.role !== 'lawyer') {
          navigate('/');
          return;
        }

        loadConsultations();
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else {
      navigate('/login');
    }
  }, []);

  const loadConsultations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/consultations/lawyer/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setPendingConsultations(data.data || []);
      }

      const response2 = await fetch('http://localhost:5000/api/consultations/lawyer/assigned', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data2 = await response2.json();
      if (response2.ok) {
        setAssignedConsultations(data2.data || []);
      }
    } catch (err) {
      console.error('Error loading consultations:', err);
      setError('Failed to load consultations');
    }
  };

  const handleAssign = async (consultationId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/consultations/${consultationId}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        loadConsultations();
        setError('');
      } else {
        setError(data.message || 'Failed to assign consultation');
      }
    } catch (err) {
      setError('Error assigning consultation');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResponse = async () => {
    if (!response.trim()) {
      setError('Please enter a response');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/consultations/${selectedConsultation._id}/respond`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ response }),
      });

      const data = await res.json();
      if (res.ok) {
        loadConsultations();
        setSelectedConsultation(null);
        setResponse('');
        setError('');
      } else {
        setError(data.message || 'Failed to submit response');
      }
    } catch (err) {
      setError('Error submitting response');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'responded':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Lawyer Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome, {user.firstName} {user.lastName}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {selectedConsultation ? (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{selectedConsultation.query_title}</CardTitle>
                <p className="text-sm text-gray-600 mt-2">Category: {selectedConsultation.category}</p>
              </div>
              <Badge className={getStatusColor(selectedConsultation.status)}>{selectedConsultation.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Question</h4>
              <p className="text-gray-700">{selectedConsultation.detailed_question}</p>
            </div>

            {selectedConsultation.response && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Your Response</h4>
                <p className="text-gray-700">{selectedConsultation.response}</p>
              </div>
            )}

            {selectedConsultation.status !== 'responded' && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Submit Response</h4>
                <Textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Enter your legal advice here..."
                  className="min-h-32"
                />
                <Button
                  onClick={handleSubmitResponse}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Submitting...' : 'Submit Response'}
                </Button>
              </div>
            )}

            <Button
              onClick={() => setSelectedConsultation(null)}
              className="w-full"
              variant="outline"
            >
              Back
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex gap-4 mb-8">
            <Button
              onClick={() => setActiveTab('pending')}
              className={`${
                activeTab === 'pending'
                  ? 'bg-yellow-600 hover:bg-yellow-700'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            >
              <Clock className="w-4 h-4 mr-2" />
              Pending ({pendingConsultations.length})
            </Button>
            <Button
              onClick={() => setActiveTab('assigned')}
              className={`${
                activeTab === 'assigned'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Assigned ({assignedConsultations.length})
            </Button>
          </div>

          {activeTab === 'pending' && (
            <div className="space-y-4">
              {pendingConsultations.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center">
                    <p className="text-gray-600">No pending consultations</p>
                  </CardContent>
                </Card>
              ) : (
                pendingConsultations.map((consultation) => (
                  <Card key={consultation._id} className="hover:shadow-lg transition">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{consultation.query_title}</h3>
                          <p className="text-sm text-gray-600">Category: {consultation.category}</p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                      </div>
                      <p className="text-gray-700 mb-4 line-clamp-2">{consultation.detailed_question}</p>
                      <p className="text-xs text-gray-500 mb-4">
                        Submitted: {new Date(consultation.createdAt).toLocaleDateString()}
                      </p>
                      <Button
                        onClick={() => handleAssign(consultation._id)}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Take This Case
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === 'assigned' && (
            <div className="space-y-4">
              {assignedConsultations.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center">
                    <p className="text-gray-600">No assigned consultations</p>
                  </CardContent>
                </Card>
              ) : (
                assignedConsultations.map((consultation) => (
                  <Card key={consultation._id} className="hover:shadow-lg transition">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{consultation.query_title}</h3>
                          <p className="text-sm text-gray-600">Category: {consultation.category}</p>
                        </div>
                        <Badge className={getStatusColor(consultation.status)}>{consultation.status}</Badge>
                      </div>
                      <p className="text-gray-700 mb-4 line-clamp-2">{consultation.detailed_question}</p>
                      <p className="text-xs text-gray-500 mb-4">
                        User: {consultation.userId?.firstName} {consultation.userId?.lastName}
                      </p>
                      <Button
                        onClick={() => setSelectedConsultation(consultation)}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        {consultation.status === 'responded' ? 'View Response' : 'Add Response'}
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
