import { useState } from "react";
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { Link } from "react-router-dom";

const QuizMode = () => {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const topics = ["DSA", "OS", "Networking", "DBMS", "Java", "Python", "C++", "Machine Learning"];

  const startQuiz = async () => {
    const topic = customTopic || selectedTopic;
    if (!topic) return;

    setIsLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          topic: topic,
          num_questions: 5
        })
      });

      const data = await res.json();

      if (data.questions && Array.isArray(data.questions)) {
        setCurrentQuestions(data.questions);
        setQuizStarted(true);
        setCurrentQuestionIndex(0);
        setScore(0);
        setQuizCompleted(false);
        setSelectedAnswer(null);
        setShowAnswer(false);
      } else {
        alert("Failed to load quiz questions. Please try again.");
      }
    } catch (err) {
      console.error("Quiz Fetch Error:", err);
      alert("An error occurred while fetching the quiz.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
    const currentQ = currentQuestions[currentQuestionIndex];
    if (
      currentQ.options[parseInt(selectedAnswer)] === currentQ.correctAnswer
    ) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < currentQuestions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestions([]);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedTopic("");
    setCustomTopic("");
  };

  const getFeedbackMessage = (finalScore, total) =>
    finalScore / total >= 0.8 ? "Great job! 🎉" : "Good attempt! 👍";

  const currentQuestion = currentQuestions[currentQuestionIndex];
  const isCorrect =
    showAnswer &&
    currentQuestion &&
    currentQuestion.options[parseInt(selectedAnswer)] === currentQuestion.correctAnswer;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quiz Mode</h1>
      </div>

      {!quizStarted && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Choose a Topic</h2>
          <div className="space-y-6">
            <Select onValueChange={setSelectedTopic} value={selectedTopic}>
              <SelectTrigger className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
  <SelectValue placeholder="Select a topic to start the quiz" />
</SelectTrigger>

              <SelectContent>
                {topics.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="text-center text-gray-500 dark:text-gray-400 font-medium">OR</div>

          <label className="block text-gray-800 dark:text-gray-200 font-medium text-base">
  Select a Custom Topic:
</label>
<Input
  value={customTopic}
  onChange={(e) => setCustomTopic(e.target.value)}
  placeholder="e.g., Machine Learning, Web Development, etc."
  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
/>


            <Button
              onClick={startQuiz}
              disabled={(!selectedTopic && !customTopic.trim()) || isLoading}
              className="w-full text-lg py-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Quiz...
                </>
              ) : (
                "Start Quiz"
              )}
            </Button>
          </div>
        </div>
      )}

      {quizStarted && !quizCompleted && currentQuestion && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <div className="flex justify-between mb-6 text-gray-700 dark:text-gray-300">
            <span>Question {currentQuestionIndex + 1} of {currentQuestions.length}</span>
            <span>Score: {score}</span>
          </div>
          <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            {currentQuestion.question}
          </h3>
          <RadioGroup
            value={selectedAnswer}
            onValueChange={setSelectedAnswer}
            className="space-y-3 mb-6"
            disabled={showAnswer}
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <label htmlFor={`option-${index}`} className="text-lg cursor-pointer text-gray-800 dark:text-gray-200">
                  {option}
                </label>
              </div>
            ))}
          </RadioGroup>

          {showAnswer && (
            <div className={`p-4 rounded-lg mb-4 ${
              isCorrect
                ? "bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/50 dark:border-emerald-700"
                : "bg-red-50 border border-red-200 dark:bg-red-900/50 dark:border-red-700"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? <CheckCircle className="h-5 w-5 text-emerald-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
                <span className={`font-semibold ${isCorrect ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"}`}>
                  {isCorrect ? "Correct!" : "Incorrect"}
                </span>
              </div>
              <p className="text-gray-800 dark:text-gray-200">
                <strong>Correct Answer:</strong> {currentQuestion.correctAnswer}
              </p>
            </div>
          )}

          <div className="flex gap-4">
            {!showAnswer ? (
              <Button onClick={handleShowAnswer} disabled={selectedAnswer === null}>Submit</Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                {currentQuestionIndex < currentQuestions.length - 1 ? "Next" : "Finish"}
              </Button>
            )}
          </div>
        </div>
      )}

      {quizCompleted && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Quiz Completed!</h2>
          <p className="text-6xl mb-4">{getFeedbackMessage(score, currentQuestions.length)}</p>
          <p className="text-xl mb-4 text-gray-700 dark:text-gray-300">
            Your Score: <span className="font-bold text-blue-600 dark:text-blue-400">{score} / {currentQuestions.length}</span>
          </p>
          <Button onClick={handleRestartQuiz}>Start New Quiz</Button>
        </div>
      )}
    </div>
  );
};

export default QuizMode;
