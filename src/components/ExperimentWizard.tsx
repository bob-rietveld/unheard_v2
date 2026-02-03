import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Id } from '../../convex/_generated/dataModel';
import Button from './ui/Button';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Label from './ui/Label';

// Wizard step 1: Basic Info
const basicInfoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
});

// Wizard step 2: Prompt
const promptSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(2000, 'Prompt must be less than 2000 characters'),
});

// Wizard step 3: Select Personas
const personasSchema = z.object({
  personas: z.array(z.string()).min(1, 'At least one persona must be selected'),
});

// Full form schema
const experimentSchema = basicInfoSchema.merge(promptSchema).merge(personasSchema);

export type ExperimentFormData = z.infer<typeof experimentSchema>;

interface ExperimentWizardProps {
  onSubmit: (data: ExperimentFormData) => void | Promise<void>;
  personas: Array<{ _id: Id<'personas'>; name: string; description: string }>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export default function ExperimentWizard({
  onSubmit,
  personas,
  isLoading = false,
  onCancel,
}: ExperimentWizardProps) {
  const [step, setStep] = useState(1);

  // Step 1 form
  const basicInfoForm = useForm({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  // Step 2 form
  const promptForm = useForm({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      prompt: '',
    },
  });

  // Step 3 form
  const personasForm = useForm({
    resolver: zodResolver(personasSchema),
    defaultValues: {
      personas: [],
    },
  });

  // Store data from each step
  const [stepData, setStepData] = useState<Partial<ExperimentFormData>>({});

  const handleStep1Submit = (data: z.infer<typeof basicInfoSchema>) => {
    setStepData((prev) => ({ ...prev, ...data }));
    setStep(2);
  };

  const handleStep2Submit = (data: z.infer<typeof promptSchema>) => {
    setStepData((prev) => ({ ...prev, ...data }));
    setStep(3);
  };

  const handleStep3Submit = (data: z.infer<typeof personasSchema>) => {
    const finalData = { ...stepData, ...data } as ExperimentFormData;
    onSubmit(finalData);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handlePersonaToggle = (personaId: string) => {
    const currentPersonas = personasForm.getValues('personas');
    if (currentPersonas.includes(personaId)) {
      personasForm.setValue(
        'personas',
        currentPersonas.filter((id) => id !== personaId)
      );
    } else {
      personasForm.setValue('personas', [...currentPersonas, personaId]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-medium ${
                  stepNumber === step
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : stepNumber < step
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-300 bg-white text-gray-500'
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    stepNumber < step ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className={`text-sm ${step === 1 ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
            Basic Info
          </span>
          <span className={`text-sm ${step === 2 ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
            Prompt
          </span>
          <span className={`text-sm ${step === 3 ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
            Select Personas
          </span>
        </div>
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <form onSubmit={basicInfoForm.handleSubmit(handleStep1Submit)} className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
            <p className="text-gray-600">
              Give your experiment a title and description to help you identify it later.
            </p>
          </div>

          <div>
            <Label htmlFor="title" required>
              Title
            </Label>
            <Input
              id="title"
              {...basicInfoForm.register('title')}
              placeholder="e.g., Product Launch Feedback"
              error={basicInfoForm.formState.errors.title?.message}
            />
            {basicInfoForm.formState.errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {basicInfoForm.formState.errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description" required>
              Description
            </Label>
            <Textarea
              id="description"
              {...basicInfoForm.register('description')}
              placeholder="Describe what you want to test or learn from this experiment..."
              rows={4}
              error={basicInfoForm.formState.errors.description?.message}
            />
            {basicInfoForm.formState.errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {basicInfoForm.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            {onCancel && (
              <Button type="button" variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit">Next</Button>
          </div>
        </form>
      )}

      {/* Step 2: Prompt */}
      {step === 2 && (
        <form onSubmit={promptForm.handleSubmit(handleStep2Submit)} className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Experiment Prompt</h2>
            <p className="text-gray-600">
              Write the prompt or question that each persona will respond to.
            </p>
          </div>

          <div>
            <Label htmlFor="prompt" required>
              Prompt
            </Label>
            <Textarea
              id="prompt"
              {...promptForm.register('prompt')}
              placeholder="e.g., What are your thoughts on our new product feature? How would it help solve your daily challenges?"
              rows={8}
              error={promptForm.formState.errors.prompt?.message}
            />
            {promptForm.formState.errors.prompt && (
              <p className="mt-1 text-sm text-red-600">
                {promptForm.formState.errors.prompt.message}
              </p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              Tip: Be specific about what feedback you're looking for. The personas will respond
              based on their characteristics and perspectives.
            </p>
          </div>

          <div className="flex justify-between gap-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={handleBack}>
              Back
            </Button>
            <Button type="submit">Next</Button>
          </div>
        </form>
      )}

      {/* Step 3: Select Personas */}
      {step === 3 && (
        <form onSubmit={personasForm.handleSubmit(handleStep3Submit)} className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Personas</h2>
            <p className="text-gray-600">
              Choose which personas will participate in this experiment.
            </p>
          </div>

          {personas.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-600 mb-4">No personas available.</p>
              <p className="text-sm text-gray-500">
                Create personas first before running an experiment.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {personas.map((persona) => {
                const isSelected = personasForm.watch('personas').includes(persona._id);
                return (
                  <div
                    key={persona._id}
                    onClick={() => handlePersonaToggle(persona._id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handlePersonaToggle(persona._id)}
                        className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{persona.name}</h3>
                        <p className="mt-1 text-sm text-gray-600">{persona.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {personasForm.formState.errors.personas && (
            <p className="text-sm text-red-600">
              {personasForm.formState.errors.personas.message}
            </p>
          )}

          <div className="flex justify-between gap-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={handleBack}>
              Back
            </Button>
            <Button type="submit" disabled={isLoading || personas.length === 0}>
              {isLoading ? 'Creating...' : 'Create Experiment'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
