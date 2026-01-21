import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageSquare, Send, Clock, User, AlertCircle } from "lucide-react";

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

export default function ConsultationPage() {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("submit");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

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
    if (!token || !user || user.role === "lawyer") {
      navigate("/login");
      return;
    }
    loadConsultations();
  }, [token, user, navigate]);

  const loadConsultations = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/consultations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setConsultations(Array.isArray(data) ? data : (data.data || []));
      } else {
        setError(data.message || "Failed to load consultations");
      }
    } catch (err) {
      console.error("Error loading consultations:", err);
      setError("Failed to load consultations");
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
      const response = await fetch("http://localhost:5000/api/consultations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Consultation submitted successfully! A lawyer will review it shortly.");
        
        // Reset form
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

        await loadConsultations();
        setTimeout(() => setActiveTab("status"), 1500);
      } else {
        setError(data.message || "Failed to submit consultation");
        console.error("Submission error:", data);
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("Error submitting consultation: " + err.message);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Legal Consultation</h1>
          <p className="text-lg text-slate-600">
            Submit your legal doubt and get expert guidance
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}

        {/* TABS */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          <Button
            onClick={() => setActiveTab("submit")}
            className={`px-4 py-2 rounded-md transition-all ${
              activeTab === "submit"
                ? "bg-green-600 hover:bg-green-700 text-white shadow-md"
                : "bg-green-300 hover:bg-green-400 text-slate-900"
            }`}
          >
            Submit Query
          </Button>

          <Button
            onClick={() => setActiveTab("status")}
            className={`px-4 py-2 rounded-md transition-all ${
              activeTab === "status"
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                : "bg-blue-300 hover:bg-blue-400 text-slate-900"
            }`}
          >
            My Consultations
          </Button>
        </div>

        {/* SUBMIT TAB */}
        {activeTab === "submit" && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                Submit Consultation
              </CardTitle>
            </CardHeader>

            <CardContent>
     <form onSubmit={handleSubmit} className="space-y-10 p-4 md:p-6 lg:p-8">

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

        {/* Location */}
        <div>
          <Label>Your Location</Label>
          <Input
            value={formData.user_location}
            onChange={(e) => setFormData({ ...formData, user_location: e.target.value })}
            placeholder="City / State"
            className="mt-2 h-12 w-full border border-slate-300 rounded-lg"
          />
        </div>

        {/* Urgency */}
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
    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg"
  >
    {isSubmitting ? "Submitting..." : "Submit Consultation"}
  </Button>
</form>

            </CardContent>
          </Card>
        )}

        {/* STATUS TAB */}
        {activeTab === "status" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center text-slate-900">
              Your Consultations
            </h2>

            {consultations.length === 0 ? (
              <Card className="text-center py-10">
                <CardContent>
                  <MessageSquare className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">No consultations yet</h3>
                  <p className="text-slate-600 mb-4">
                    Submit your first legal query to get started.
                  </p>
                  <Button onClick={() => setActiveTab("submit")}>Submit Query</Button>
                </CardContent>
              </Card>
            ) : (
              consultations.map((item) => (
                <Card key={item._id} className="shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Badge className="mb-2 bg-yellow-100 text-yellow-800">
                          <Clock className="w-4 h-4 mr-1" />
                          {item.status}
                        </Badge>

                        <Badge variant="outline" className="ml-2">
                          {categories.find((c) => c.value === item.category)?.label}
                        </Badge>

                        <CardTitle className="text-lg mt-2">
                          {item.query_title}
                        </CardTitle>

                        <p className="text-slate-600 text-sm mt-1">
                          {item.detailed_question}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  {item.response && (
                    <CardContent className="bg-green-50 border-t pt-3 pb-3">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <User className="w-4 h-4" /> Lawyer Response:
                      </div>
                      <p className="text-slate-700 mt-2">{item.response}</p>
                      {item.responseDate && (
                        <p className="text-xs text-slate-500 mt-2">
                          Responded: {new Date(item.responseDate).toLocaleDateString()}
                        </p>
                      )}
                    </CardContent>
                  )}

                  <CardContent className="border-t pt-3 text-xs text-slate-500 flex justify-between flex-wrap gap-2">
                    <span>
                      Submitted: {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <span>Query ID: #{item._id.slice(0, 8)}</span>
                    {item.assignedLawyerId && (
                      <span>Assigned to Lawyer</span>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
