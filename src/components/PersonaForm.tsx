import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from './ui/Button';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Label from './ui/Label';
import TagInput from './ui/TagInput';

const personaSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  attributes: z.object({
    age: z.number().int().positive().optional().or(z.literal('')),
    gender: z.string().max(50).optional(),
    occupation: z.string().max(100).optional(),
    interests: z.array(z.string()).optional(),
    painPoints: z.array(z.string()).optional(),
    goals: z.array(z.string()).optional(),
  }),
});

export type PersonaFormData = z.infer<typeof personaSchema>;

interface PersonaFormProps {
  onSubmit: (data: PersonaFormData) => void | Promise<void>;
  initialData?: Partial<PersonaFormData>;
  isLoading?: boolean;
}

export default function PersonaForm({
  onSubmit,
  initialData,
  isLoading = false,
}: PersonaFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PersonaFormData>({
    resolver: zodResolver(personaSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      attributes: {
        age: undefined,
        gender: '',
        occupation: '',
        interests: [],
        painPoints: [],
        goals: [],
      },
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div>
        <Label htmlFor="name" required>
          Name
        </Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="e.g., Sarah Tech Enthusiast"
          error={errors.name?.message}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description" required>
          Description
        </Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Describe this persona's background, personality, and context..."
          rows={4}
          error={errors.description?.message}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Attributes Section */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Attributes</h3>

        <div className="space-y-4">
          {/* Age */}
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              {...register('attributes.age', { valueAsNumber: true })}
              placeholder="e.g., 28"
              error={errors.attributes?.age?.message}
            />
            {errors.attributes?.age && (
              <p className="mt-1 text-sm text-red-600">{errors.attributes.age.message}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Input
              id="gender"
              {...register('attributes.gender')}
              placeholder="e.g., Female, Male, Non-binary"
              error={errors.attributes?.gender?.message}
            />
            {errors.attributes?.gender && (
              <p className="mt-1 text-sm text-red-600">{errors.attributes.gender.message}</p>
            )}
          </div>

          {/* Occupation */}
          <div>
            <Label htmlFor="occupation">Occupation</Label>
            <Input
              id="occupation"
              {...register('attributes.occupation')}
              placeholder="e.g., Software Engineer"
              error={errors.attributes?.occupation?.message}
            />
            {errors.attributes?.occupation && (
              <p className="mt-1 text-sm text-red-600">{errors.attributes.occupation.message}</p>
            )}
          </div>

          {/* Interests */}
          <div>
            <Label htmlFor="interests">Interests</Label>
            <Controller
              name="attributes.interests"
              control={control}
              render={({ field }) => (
                <TagInput
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Type an interest and press Enter"
                  error={errors.attributes?.interests?.message}
                />
              )}
            />
            {errors.attributes?.interests && (
              <p className="mt-1 text-sm text-red-600">{errors.attributes.interests.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Add tags by typing and pressing Enter
            </p>
          </div>

          {/* Pain Points */}
          <div>
            <Label htmlFor="painPoints">Pain Points</Label>
            <Controller
              name="attributes.painPoints"
              control={control}
              render={({ field }) => (
                <TagInput
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Type a pain point and press Enter"
                  error={errors.attributes?.painPoints?.message}
                />
              )}
            />
            {errors.attributes?.painPoints && (
              <p className="mt-1 text-sm text-red-600">{errors.attributes.painPoints.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              What challenges or frustrations does this persona face?
            </p>
          </div>

          {/* Goals */}
          <div>
            <Label htmlFor="goals">Goals</Label>
            <Controller
              name="attributes.goals"
              control={control}
              render={({ field }) => (
                <TagInput
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Type a goal and press Enter"
                  error={errors.attributes?.goals?.message}
                />
              )}
            />
            {errors.attributes?.goals && (
              <p className="mt-1 text-sm text-red-600">{errors.attributes.goals.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              What does this persona want to achieve?
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Persona'}
        </Button>
      </div>
    </form>
  );
}
