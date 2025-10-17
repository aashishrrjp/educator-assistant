"use client";

import { type FC } from "react"; // FIX: Changed import to TeacherNav
import { TeacherNav } from "@/components/teacher-nav";
import { Heart, Youtube, GraduationCap } from "lucide-react";

// --- Data for the Wellbeing Resources ---
const wellbeingResources = [
  {
    id: 1,
    title: "The Science of Well-Being",
    platform: "Coursera",
    description: "Yale's most popular course on the science of happiness and building productive habits.",
    url: "https://www.coursera.org/learn/the-science-of-well-being",
    type: "Course",
    color: "from-blue-500 to-blue-700",
  },
  {
    id: 2,
    title: "Mindful Wellbeing for Teachers",
    platform: "FutureLearn",
    description: "Learn mindfulness techniques to manage stress and anxiety in the teaching profession.",
    url: "https://www.futurelearn.com/courses/mindful-wellbeing-teachers-stress-anxiety",
    type: "Course",
    color: "from-green-500 to-green-700",
  },
  {
    id: 3,
    title: "Keeping Teachers Teaching",
    platform: "Udemy",
    description: "Strategies for teacher retention, wellness, and avoiding professional burnout.",
    url: "https://www.udemy.com/course/keeping-teachers-teaching/",
    type: "Course",
    color: "from-purple-500 to-purple-700",
  },
  {
    id: 4,
    title: "Digital Wellbeing in the Classroom",
    platform: "Teacher Academy",
    description: "Promote healthy and effective digital habits for both teachers and their students.",
    url: "https://www.teacheracademy.eu/course/digital-wellbeing/",
    type: "Course",
    color: "from-sky-500 to-sky-700",
  },
  {
    id: 5,
    title: "Mental Wellbeing Strategies",
    platform: "YouTube",
    description: "A video guide on practical strategies for maintaining mental health as an educator.",
    url: "https://www.youtube.com/watch?v=zNAIzVZ8kYA",
    type: "Video",
    color: "from-red-500 to-red-700",
  },
  {
    id: 6,
    title: "Physical Health for Busy Teachers",
    platform: "YouTube",
    description: "A focused session with actionable physical health tips for the demanding teaching schedule.",
    url: "https://www.youtube.com/watch?v=I5XZrKPIMBE",
    type: "Video",
    color: "from-red-500 to-red-700",
  },
  {
    id: 7,
    title: "The Importance of Teacher Wellness",
    platform: "YouTube",
    description: "An insightful video discussing the impact of physical and mental wellness for educators.",
    url: "https://www.youtube.com/watch?v=vrU6YJle6Q4",
    type: "Video",
    color: "from-red-500 to-red-700",
  },
  {
    id: 8,
    title: "Well-Being & Self-Care for Physical and Mental Health",
    platform: "Coursera",
    description: "A course focusing on practical strategies for self-care and improving overall health.",
    url: "https://www.coursera.org/learn/well-being-self-care-for-physical-and-mental-health",
    type: "Course",
    color: "from-teal-500 to-teal-700",
  },
  {
    id: 9,
    title: "Social and Emotional Learning (SEL) for Teachers",
    platform: "Coursera",
    description: "Develop skills in social and emotional learning to support students and enhance your own wellbeing.",
    url: "https://www.coursera.org/learn/teachers-social-emotional-learning",
    type: "Course",
    color: "from-orange-500 to-orange-700",
  },
];

const TeacherWellbeingPage: FC = () => {
  return (
    <div className="flex h-screen bg-background">
      <TeacherNav />
      <main className="flex-1 overflow-y-auto">
        <header className="border-b border-border bg-card px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-pink-500/10 flex items-center justify-center">
              <Heart className="h-5 w-5 text-pink-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Teacher Wellbeing Hub</h1>
              <p className="text-sm text-muted-foreground">Resources to support your mental and physical health.</p>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* We use a container with perspective for the 3D effect */}
          <div style={{ perspective: "1000px" }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wellbeingResources.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div
                  style={{ transformStyle: "preserve-3d" }}
                  className={`relative h-56 rounded-xl shadow-lg p-6 flex flex-col justify-between text-white bg-gradient-to-br ${resource.color} 
                             transition-all duration-300 ease-in-out 
                             group-hover:scale-105 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:[transform:rotateX(10deg)_rotateY(-10deg)]`}
                >
                  {/* Glossy overlay effect */}
                  <div className="absolute top-0 left-0 w-full h-full bg-black/10 rounded-xl"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg">{resource.title}</h3>
                      {resource.type === 'Course' ? 
                        <GraduationCap className="h-5 w-5 opacity-70" /> : 
                        <Youtube className="h-5 w-5 opacity-70" />
                      }
                    </div>
                    <p className="text-sm font-light opacity-90">{resource.description}</p>
                  </div>
                  <div className="relative z-10 text-xs font-semibold opacity-80">{resource.platform}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherWellbeingPage;
