import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16 flex items-center justify-center">
      <div className="text-center space-y-8 bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-lg">
        <div className="flex justify-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500" />
        </div>
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
            404 - Page Not Found
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Oops! The page you are looking for does not exist.
          </p>
        </div>
        <Link to="/">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl"
          >
            Go Back Home
          </Button>
        </Link>
      </div>
    </main>
  );
};

export default NotFound;