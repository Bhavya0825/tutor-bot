import { Link } from "react-router-dom";
import { MessageCircle, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            TutorIQ – Your Personal Learning Tutor
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Chat with an AI Tutor and test your knowledge with quizzes.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
          <Link to="/chat">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 min-w-[200px]"
            >
              <MessageCircle className="h-6 w-6" />
              Start Chat
            </Button>
          </Link>
          <Link to="/quiz">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 min-w-[200px]"
            >
              <Brain className="h-6 w-6" />
              Take a Quiz
            </Button>
          </Link>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-2 gap-8 mt-16">
          <div className="bg-blue-50 dark:bg-gray-800 p-6 rounded-2xl border border-blue-100 dark:border-gray-700">
            <MessageCircle className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              AI Chat Tutor
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get instant help with programming concepts, data structures, and more through our intelligent chat interface.
            </p>
          </div>
          <div className="bg-emerald-50 dark:bg-gray-800 p-6 rounded-2xl border border-emerald-100 dark:border-gray-700">
            <Brain className="h-12 w-12 text-emerald-600 dark:text-emerald-400 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Interactive Quizzes
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Test your knowledge with quizzes on various topics including DSA, OS, networking, and programming languages.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Index;

