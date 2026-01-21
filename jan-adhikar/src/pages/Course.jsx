import React, { useState, useEffect } from 'react';
import { Course as CourseModel } from '@/Entities/Course.jsx';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Clock, BarChart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const convertToEmbedUrl = (url) =>
  url ? url.replace("watch?v=", "embed/") : url;

const CourseCard = ({ course }) => (
  <Link to={`/courses/${course.id}`} className="block hover:no-underline">
    <Card className="h-full flex flex-col hover:shadow-xl transition duration-300 group">
      
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline">{course.category.replace(/_/g, ' ')}</Badge>
          <GraduationCap className="w-6 h-6 text-blue-500" />
        </div>
        <CardTitle>{course.title}</CardTitle>
      </CardHeader>

      {course.youtube_url && (
        <div className="px-4 pb-4">
          <iframe
            className="rounded-lg w-full h-48"
            src={convertToEmbedUrl(course.youtube_url)}
            allowFullScreen
          ></iframe>
        </div>
      )}

      <CardContent className="flex-grow">
        <CardDescription>{course.description}</CardDescription>
      </CardContent>

      <div className="border-t p-4 text-sm text-slate-500 flex justify-between items-center">
        <div className="flex gap-4">
          <Clock className="w-4 h-4" /> {course.estimated_duration}
          <BarChart className="w-4 h-4" /> {course.difficulty_level}
        </div>
        <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition" />
      </div>
    </Card>
  </Link>
);

export default function Course() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    CourseModel.list().then(setCourses);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 mt-10">
      <h1 className="text-3xl font-bold text-center text-cyan-400">Legal Awareness Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
