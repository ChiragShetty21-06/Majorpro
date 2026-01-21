import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Send, CheckCircle } from "lucide-react";

const categories = [
  { value: "family_law", label: "Family Law", description: "Marriage, divorce, custody" },
  { value: "property_dispute", label: "Property Disputes", description: "Land, housing" },
  { value: "employment_issue", label: "Employment Issues", description: "Salary, termination" },
  { value: "consumer_complaint", label: "Consumer Complaints", description: "Product & service issues" },
  { value: "criminal_matter", label: "Criminal Matters", description: "FIR, bail, IPC" },
  { value: "civil_rights", label: "Civil Rights", description: "Fundamental rights violations" },
  { value: "government_services", label: "Govt Services", description: "Documentation issues" },
  { value: "documentation", label: "Documentation", description: "Agreements, drafting" },
  { value: "other", label: "Other", description: "General legal queries" }
];

export default function QuerySubmitPage() {
  const { user, isLoaded } = useUser();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userQueries, setUserQueries] = useState([]);

  const [formData, setFormData] = useState({
    query_title: "",
    detailed_question: "",
    category: "",
    urgency_level: "medium",
    user_location: "",
    contact_preference: "email",
    language: "english",
    is_anonymous: false,
  });

  useEffect(() => {
    if (isLoaded && user) {
      loadUserQueries();
    }
  }, [isLoaded, user]);

  const loadUserQueries = async () => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch(`http://localhost:5000/api/consultations`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUserQueries(Array.isArray(data) ? data : (data.data || []));
      }
    } catch (err) {
      console.error("Error loading queries:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!formData.query_title || !formData.detailed_question || !formData.category) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await user?.getIdToken();
      const response = await fetch("http://localhost:5000/api/consultations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          clerkUserId: user.id,
          userEmail: user.primaryEmailAddress?.emailAddress,
          userName: user.firstName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Query submitted successfully! A lawyer will review it shortly.");
        setFormData({
          query_title: "",
          detailed_question: "",
          category: "",
          urgency_level: "medium",
          user_location: "",
          contact_preference: "email",
          language: "english",
          is_anonymous: false,
        });
        await loadUserQueries();
      } else {
        setError(data.message || "Failed to submit query");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("Error submitting query: " + err.message);
    }

    setIsSubmitting(false);
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Send className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Submit Your Legal Query</h1>
          <p className="text-lg text-slate-600">
            Describe your legal issue and get expert guidance from verified lawyers
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}

        {/* FORM */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-purple-600" />
              Submit Your Query
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">

              {/* BASIC INFORMATION */}
              <Card className="border border-slate-200 shadow-sm p-5 md:p-7">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Basic Information</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Title */}
                  <div>
                    <Label className="font-medium text-slate-700">Query Title *</Label>
                    <Input
                      value={formData.query_title}
                      onChange={(e) => setFormData({ ...formData, query_title: e.target.value })}
                      placeholder="Enter a short title for your legal issue"
                      className="mt-2 h-12 w-full border border-slate-300 rounded-lg"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <Label className="font-medium text-slate-700">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger className="mt-2 h-12 w-full border border-slate-300 rounded-lg">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem value={cat.value} key={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* DETAILED DESCRIPTION */}
              <Card className="border border-slate-200 shadow-sm p-5 md:p-7">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Detailed Description</CardTitle>
                </CardHeader>

                <CardContent>
                  <Label className="font-medium text-slate-700">Explain your issue *</Label>
                  <Textarea
                    value={formData.detailed_question}
                    onChange={(e) => setFormData({ ...formData, detailed_question: e.target.value })}
                    className="mt-2 min-h-[180px] w-full border border-slate-300 rounded-lg"
                    placeholder="Describe your issue clearly..."
                    required
                  />
                </CardContent>
              </Card>

              {/* ADDITIONAL INFORMATION */}
              <Card className="border border-slate-200 shadow-sm p-5 md:p-7">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Additional Information</CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Location & Urgency */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Your Location</Label>
                      <Input
                        value={formData.user_location}
                        onChange={(e) => setFormData({ ...formData, user_location: e.target.value })}
                        placeholder="City / State"
                        className="mt-2 h-12 w-full border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <Label>Urgency Level</Label>
                      <Select
                        value={formData.urgency_level}
                        onValueChange={(value) => setFormData({ ...formData, urgency_level: value })}
                      >
                        <SelectTrigger className="mt-2 h-12 w-full border border-slate-300 rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Anonymous */}
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="anonymous"
                      checked={formData.is_anonymous}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_anonymous: checked })}
                    />
                    <Label htmlFor="anonymous" className="text-sm">Submit anonymously</Label>
                  </div>
                </CardContent>
              </Card>

              {/* SUBMIT BUTTON */}
              <Button
                type="submit"
                disabled={!formData.query_title || !formData.detailed_question || !formData.category || isSubmitting}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Query"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* YOUR QUERIES */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Submitted Queries</h2>
          
          {userQueries.length === 0 ? (
            <Card className="text-center py-10">
              <CardContent>
                <Send className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600">No queries submitted yet</h3>
                <p className="text-slate-500 mt-2">Submit your first query above to get started</p>
              </CardContent>
            </Card>
          ) : (
            userQueries.map((query) => (
              <Card key={query._id} className="shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Badge className={`mb-2 ${
                        query.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        query.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                        query.status === 'responded' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {query.status.toUpperCase()}
                      </Badge>

                      <Badge variant="outline" className="ml-2">
                        {categories.find((c) => c.value === query.category)?.label}
                      </Badge>

                      <CardTitle className="text-lg mt-2">
                        {query.query_title}
                      </CardTitle>

                      <p className="text-slate-600 text-sm mt-2">
                        {query.detailed_question}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                {query.response && (
                  <CardContent className="bg-green-50 border-t pt-4 pb-4">
                    <div className="flex items-center gap-2 text-sm font-medium mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" /> Lawyer Response:
                    </div>
                    <p className="text-slate-700 text-sm">{query.response}</p>
                  </CardContent>
                )}

                <CardContent className="border-t pt-3 text-xs text-slate-500 flex justify-between flex-wrap gap-2">
                  <span>Submitted: {new Date(query.createdAt).toLocaleDateString()}</span>
                  <span>ID: #{query._id.slice(0, 8)}</span>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
