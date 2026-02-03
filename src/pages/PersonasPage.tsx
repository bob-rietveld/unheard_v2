import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import PersonaForm, { PersonaFormData } from '../components/PersonaForm';
import Button from '../components/ui/Button';
import { Plus } from 'lucide-react';

export default function PersonasPage() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPersona = useMutation(api.personas.create);

  // TODO: Get actual user ID from auth context
  const mockUserId = 'mock-user-id' as any;

  const personas = useQuery(api.personas.listByUser, { userId: mockUserId }) || [];

  const handleSubmit = async (data: PersonaFormData) => {
    setIsSubmitting(true);
    try {
      await createPersona({
        name: data.name,
        description: data.description,
        attributes: {
          age: data.attributes.age || undefined,
          gender: data.attributes.gender || undefined,
          occupation: data.attributes.occupation || undefined,
          interests: data.attributes.interests?.length ? data.attributes.interests : undefined,
          painPoints: data.attributes.painPoints?.length ? data.attributes.painPoints : undefined,
          goals: data.attributes.goals?.length ? data.attributes.goals : undefined,
        },
        userId: mockUserId,
      });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create persona:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Personas</h1>
          <p className="mt-2 text-gray-600">
            Create and manage personas for your experiments
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Persona
          </Button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">New Persona</h2>
            <Button
              variant="ghost"
              onClick={() => setShowForm(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
          <PersonaForm onSubmit={handleSubmit} isLoading={isSubmitting} />
        </div>
      )}

      {/* Personas List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {personas.map((persona: any) => (
          <div
            key={persona._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {persona.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4">{persona.description}</p>

            <div className="space-y-2 text-sm">
              {persona.attributes.age && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Age:</span>
                  <span className="text-gray-900">{persona.attributes.age}</span>
                </div>
              )}
              {persona.attributes.gender && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Gender:</span>
                  <span className="text-gray-900">{persona.attributes.gender}</span>
                </div>
              )}
              {persona.attributes.occupation && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Occupation:</span>
                  <span className="text-gray-900">{persona.attributes.occupation}</span>
                </div>
              )}
              {persona.attributes.interests && persona.attributes.interests.length > 0 && (
                <div>
                  <span className="text-gray-500 block mb-1">Interests:</span>
                  <div className="flex flex-wrap gap-1">
                    {persona.attributes.interests.map((interest: string) => (
                      <span
                        key={interest}
                        className="inline-block px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-xs"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {personas.length === 0 && !showForm && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No personas yet. Create your first persona to get started.</p>
        </div>
      )}
    </div>
  );
}
