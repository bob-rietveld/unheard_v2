import { Link } from 'react-router-dom';
import { Users, FlaskConical, BarChart3 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Unheard V2
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Run AI-powered experiments with synthetic personas to understand customer behavior
          and validate ideas before building.
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {/* Personas Card */}
        <Link
          to="/personas"
          className="block p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Personas</h3>
          <p className="text-gray-600">
            Create and manage synthetic personas based on your target customers.
          </p>
        </Link>

        {/* Experiments Card */}
        <Link
          to="/experiments"
          className="block p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
            <FlaskConical className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Run Experiments</h3>
          <p className="text-gray-600">
            Set up and execute experiments to test your hypotheses.
          </p>
        </Link>

        {/* Results Card */}
        <Link
          to="/results"
          className="block p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
            <BarChart3 className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">View Results</h3>
          <p className="text-gray-600">
            Analyze experiment results and extract insights from persona responses.
          </p>
        </Link>
      </div>

      {/* Getting Started Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Getting Started</h2>
        <ol className="space-y-4">
          <li className="flex items-start">
            <span className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-600 font-semibold mr-4 flex-shrink-0">
              1
            </span>
            <div>
              <h3 className="font-medium text-gray-900">Create Personas</h3>
              <p className="text-gray-600">
                Define synthetic personas that represent your target customers with their
                demographics, behaviors, and preferences.
              </p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-600 font-semibold mr-4 flex-shrink-0">
              2
            </span>
            <div>
              <h3 className="font-medium text-gray-900">Design Experiment</h3>
              <p className="text-gray-600">
                Create an experiment with your hypothesis, questions, and select which
                personas to include.
              </p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-600 font-semibold mr-4 flex-shrink-0">
              3
            </span>
            <div>
              <h3 className="font-medium text-gray-900">Analyze Results</h3>
              <p className="text-gray-600">
                Review persona responses, sentiment analysis, and extract actionable insights
                to inform your decisions.
              </p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}
