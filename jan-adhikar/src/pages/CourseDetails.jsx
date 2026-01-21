import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Course as CourseModel } from "@/Entities/Course.jsx";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [score, setScore] = useState(null);

  useEffect(() => {
    CourseModel.getById(id).then(setCourse);
  }, [id]);

  if (!course) return <p className="text-center mt-20">Loading...</p>;

  const videoUrl = course.youtube_url?.replace("watch?v=", "embed/");

  // Hook: initialize YouTube end-scroll behavior
  useYoutubeEndScroll(course.youtube_url);

  const chooseAnswer = (qIndex, opt) => {
    setAnswers({ ...answers, [qIndex]: opt });
  };

  const submitQuiz = () => {
    setError('');
    const total = course.quizzes?.length || 0;
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < total) {
      setError('Please answer all questions before submitting the quiz.');
      return;
    }

    // Compute score
    let correct = 0;
    course.quizzes.forEach((q, i) => {
      if (answers[i] === q.answer) correct += 1;
    });
    setScore({ correct, total, percent: Math.round((correct / total) * 100) });
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 space-y-8">

      <h1 className="text-3xl font-bold">{course.title}</h1>

      {course.youtube_url && (
        <div className="space-y-4">
          <iframe
            id="yt-player"
            className="w-full h-80 rounded-lg shadow"
            src={videoUrl}
            allowFullScreen
          ></iframe>

          <div className="flex justify-end">
            <button
              onClick={() => document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700"
            >
              Take Quiz
            </button>
          </div>
        </div>
      )}

      <p className="text-lg text-gray-700">{course.description}</p>

      <h2 id="quiz" className="text-2xl font-semibold mt-10">Quiz</h2>

      {course.quizzes?.map((q, i) => (
        <div key={i} className="p-4 border rounded-lg mb-4 bg-white shadow-sm">
          <p className="font-medium">{q.question}</p>

          {q.options.map((opt, j) => {
            const selected = answers[i] === opt;
            const correct = submitted && opt === q.answer;
            const wrong = submitted && selected && opt !== q.answer;

            return (
              <button
                key={j}
                onClick={() => chooseAnswer(i, opt)}
                disabled={submitted}
                className={`block w-full text-left px-4 py-2 mt-2 rounded border
                  ${selected ? "bg-blue-200 border-blue-500" : "bg-gray-100"}
                  ${correct ? "bg-green-200 border-green-600" : ""}
                  ${wrong ? "bg-red-200 border-red-600" : ""}
                `}
              >
                {opt}
              </button>
            );
          })}

          {submitted && (
            <p className="mt-2 text-green-700">
              ✓ Correct Answer: <b>{q.answer}</b>
            </p>
          )}
        </div>
      ))}
      {error && <p className="text-red-600 font-medium">{error}</p>}

      {!submitted && (
        <button
          onClick={submitQuiz}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Submit Quiz
        </button>
      )}

      {submitted && score && (
        <div className="mt-6 p-4 bg-slate-50 rounded-lg text-center">
          <h3 className="text-xl font-semibold">Quiz Results</h3>
          <p className="mt-2 text-lg">You scored <b>{score.correct}</b> out of <b>{score.total}</b> — <b>{score.percent}%</b></p>
        </div>
      )}
    </div>
  );
}

// Load YouTube IFrame API and auto-scroll to quiz when the video ends
// This runs on the client when CourseDetails is rendered with a youtube_url
function useYoutubeEndScroll(youtubeUrl) {
  useEffect(() => {
    if (!youtubeUrl) return;

    // Extract video id from various YouTube URL patterns
    const match = youtubeUrl.match(/[?&]v=([^&\s]+)|youtu\.be\/(\w+)|embed\/(\w+)/);
    const videoId = match ? (match[1] || match[2] || match[3]) : null;
    if (!videoId) return;

    let player = null;

    const handleStateChange = (event) => {
      // YT.PlayerState.ENDED === 0
      if (event.data === 0) {
        const el = document.getElementById('quiz');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const onApiReady = () => {
      try {
        // eslint-disable-next-line no-undef
        player = new YT.Player('yt-player', {
          events: { onStateChange: handleStateChange },
        });
      } catch (e) {
        // ignore
      }
    };

    if (window.YT && window.YT.Player) {
      onApiReady();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = onApiReady;
    }

    return () => {
      try {
        if (player && typeof player.destroy === 'function') player.destroy();
      } catch (e) {}
    };
  }, [youtubeUrl]);
}
