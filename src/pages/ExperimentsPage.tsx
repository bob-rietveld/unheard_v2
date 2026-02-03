import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import ExperimentWizard, { ExperimentFormData } from '../components/ExperimentWizard';
import Button from '../components/ui/Button';
import { Plus, Play, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ExperimentsPage() {
  const [showWizard, setShowWizard] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const createExperiment = useMutation(api.experiments.create);

  // TODO: Get actual user ID from auth context
  const mockUserId = 'mock-user-id' as any;

  const experiments = useQuery(api.experiments.listByUser, { userId: mockUserId }) || [];
  const personas = useQuery(api.personas.listByUser, { userId: mockUserId }) || [];

  const handleSubmit = async (data: ExperimentFormData) => {
    setIsSubmitting(true);
    try {
      await createExperiment({
        title: data.title,
        description: data.description,
        prompt: data.prompt,
        personas: data.personas as any,
        userId: mockUserId,
      });
      setShowWizard(false);
    } catch (error) {
      console.error('Failed to create experiment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {!showWizard ? (
        <>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Experiments</h1>
              <p className="mt-2 text-gray-600">
                Create and manage experiments to test ideas with your personas
              </p>
            </div>
            <Button onClick={() => setShowWizard(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Experiment
            </Button>
          </div>

          {/* Experiments List */}
          {experiments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500 mb-4">
                No experiments yet. Create your first experiment to get started.
              </p>
              {personas.length === 0 && (
                <p className="text-sm text-gray-400 mb-4">
                  Tip: Create personas first before running experiments.
                </p>
              )}
              <Button onClick={() => setShowWizard(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Experiment
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {experiments.map((experiment: any) => (
                <div
                  key={experiment._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {experiment.title}
                        </h3>
                        <span
                          className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(
                            experiment.status
                          )}`}
                        >
                          {getStatusLabel(experiment.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        {experiment.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{experiment.personas.length} personas</span>
                        <span>•</span>
                        <span>
                          Created {new Date(experiment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {experiment.status === 'draft' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // TODO: Implement run experiment
                            console.log('Run experiment:', experiment._id);
                          }}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Run
                        </Button>
                      )}
                      {experiment.status === 'completed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/results?experimentId=${experiment._id}`)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Results
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Prompt:</span>
                      <p className="mt-1 text-gray-600 line-clamp-2">
                        {experiment.prompt}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">New Experiment</h2>
            <p className="text-gray-600">
              Create a new experiment by following the 3-step wizard
            </p>
          </div>
          <ExperimentWizard
            onSubmit={handleSubmit}
            personas={personas}
            isLoading={isSubmitting}
            onCancel={() => setShowWizard(false)}
          />
        </div>
      )}
    </div>
  );
}
