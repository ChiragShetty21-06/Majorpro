import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ThumbsUp, Send, AlertCircle } from 'lucide-react';
import { Label } from "@/components/ui/label";

export default function FeedbackPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        feedback_type: 'suggestion',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        
        try {
            const response = await fetch('http://localhost:5000/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit feedback');
            }

            setIsSubmitted(true);
            setFormData({
                name: '',
                email: '',
                feedback_type: 'suggestion',
                message: '',
            });
        } catch (err) {
            console.error("Error submitting feedback:", err);
            setError(err.message || 'Error submitting feedback. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="max-w-lg mx-auto text-center py-20">
                <ThumbsUp className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <h1 className="text-2xl font-bold text-slate-900">Thank you for your feedback!</h1>
                <p className="mt-2 text-slate-600">We appreciate you taking the time to help us improve. Your feedback has been sent to our team.</p>
                <Button onClick={() => setIsSubmitted(false)} className="mt-6">Submit Another Feedback</Button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl">Share Your Feedback</CardTitle>
                    <CardDescription>We value your opinion and suggestions to make Jan Adhikar better.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Your Name" required/>
                            </div>
                             <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Your Email" required/>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="feedback_type">Feedback Type</Label>
                            <Select value={formData.feedback_type} onValueChange={(value) => setFormData({...formData, feedback_type: value})}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="suggestion">Suggestion</SelectItem>
                                    <SelectItem value="complaint">Complaint</SelectItem>
                                    <SelectItem value="appreciation">Appreciation</SelectItem>
                                    <SelectItem value="feature_request">Feature Request</SelectItem>
                                    <SelectItem value="bug_report">Bug Report</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} placeholder="Tell us what you think..." required className="h-32"/>
                        </div>
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? 'Submitting...' : (<><Send className="w-4 h-4 mr-2" /> Submit Feedback</>)}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}