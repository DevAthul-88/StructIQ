'use client'

import { useState } from 'react'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { HelpCircle, Loader2 } from 'lucide-react'
import ProjectSelector from './ProjectsSelector'
import { CharacterCount } from './CharacterCount'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import axios from 'axios'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  project: z.string().min(1, "Project selection is required"),
  visualizationPreferences: z.object({
    floorPlan: z.boolean(),
  }).refine((data) => Object.values(data).some(Boolean), {
    message: "At least one visualization preference must be selected",
  }),
  additionalNotes: z.string().max(500, "Additional notes must be 500 characters or less"),
})

export default function NewDesignForm() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [projects, setProject] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean | null>(false)
  const router = useRouter()
  const [visualizationPreferences, setVisualizationPreferences] = useState({
    floorPlan: false,
  })
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({
    project: null,
    visualizationPreferences: null,
    additionalNotes: null,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      project: selectedProject,
      visualizationPreferences,
      additionalNotes,
    };

    // Set loading state to true when form submission starts
    setLoading(true);

    try {
      // Validate the form data using Zod schema
      formSchema.parse(formData);

      // Clear any previous errors
      setErrors({
        project: null,
        visualizationPreferences: null,
        additionalNotes: null,
      });

      // Submit the form data to the server
      const response = await axios.post("/api/design/create", formData);

      if (response.data.failed == true) {
        return toast.warning(response.data.details);
      }

      // Handle success (You can show a success toast here if needed)
      toast.success("Design created successfully!");
      const { message, generatedDesign } = response.data;

      if (generatedDesign) {
        router.push(`/designs/${generatedDesign}`);
      }

    } catch (error) {
      // Handle form validation errors
      if (error instanceof z.ZodError) {
        const newErrors = error.errors.reduce((acc, err) => {
          acc[err.path[0]] = err.message;
          return acc;
        }, {} as { [key: string]: string });

        setErrors(newErrors);
      } else if (axios.isAxiosError(error)) {
        // Handle Axios errors
        toast.error("An error occurred while submitting the form.");
      }

    } finally {
      // Set loading state to false once submission completes
      setLoading(false);
    }
  };


  const handleChange = (key) => {
    // Reset all to false, then set the selected one to true
    const newPreferences = Object.keys(visualizationPreferences).reduce((acc, k) => ({
      ...acc,
      [k]: k === key
    }), {});
    setVisualizationPreferences(newPreferences);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>New Design Generation</CardTitle>
              <CardDescription>Create a new design based on your project and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <ProjectSelector
                  selectedProject={selectedProject}
                  setSelectedProject={setSelectedProject}
                  error={errors.project}
                  setProjectsNew={setProject}
                />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Visualization Preferences</h3>
                <div>
                  <RadioGroup
                    className="space-y-2"
                    value={Object.entries(visualizationPreferences).find(([_, value]) => value)?.[0] || ""}
                    onValueChange={handleChange}
                  >
                    {Object.entries(visualizationPreferences).map(([key]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <RadioGroupItem value={key} id={key} />
                        <Label htmlFor={key} className="capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Generate a {key.replace(/([A-Z])/g, ' $1').trim().toLowerCase()} for your design</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                {errors.visualizationPreferences && (
                  <p className="mt-2 text-sm text-destructive">{errors.visualizationPreferences}</p>
                )}
              </div>

              <div>
                <Label htmlFor="additionalNotes" className="text-lg font-medium mb-2">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="Add any specific instructions or preferences here"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="mt-1"
                  maxLength={500}
                />
                <CharacterCount current={additionalNotes.length} max={500} />
                {errors.additionalNotes && (
                  <p className="mt-2 text-sm text-destructive">{errors.additionalNotes}</p>
                )}
              </div>

              <div className="mt-6">
                
                <Button type="submit" className="w-full" disabled={loading}> {loading && <Loader2 className="animate-spin" />} Generate Design</Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Information about your selected project</CardDescription>
          </CardHeader>
          <CardContent>


            {!selectedProject ? (
              <div className="text-sm text-muted-foreground">
                <p>Please select a project to view the details.</p>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                {projects.find((e) => e.id === selectedProject) ? (
                  <div className="space-y-4">
                    {(() => {
                      const selectedProjectData = projects.find((e) => e.id === selectedProject);
                      return (
                        <>
                          {/* Project Details */}
                          <div className="space-y-2">
                            <p>
                              <strong>Project:</strong> {selectedProjectData?.projectName}
                            </p>
                            <p>
                              <strong>Client:</strong> {selectedProjectData?.clientName}
                            </p>
                            <p>
                              <strong>Start Date:</strong> {new Date(selectedProjectData?.startDate).toLocaleDateString()}
                            </p>
                            <p>
                              <strong>End Date:</strong> {new Date(selectedProjectData?.endDate).toLocaleDateString()}
                            </p>
                            <p>
                              <strong>Budget:</strong> ${selectedProjectData?.budget?.toLocaleString()}
                            </p>
                            {/* Add more project-specific details if necessary */}
                          </div>

                          {/* Additional Information (Optional) */}
                          <div className="space-y-2">
                            {selectedProjectData?.description && (
                              <p>
                                <strong>Description:</strong> {selectedProjectData?.description}
                              </p>
                            )}
                            {/* You can add more fields like project status, address, etc. */}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="text-red-500">Project not found</div> // Fallback message if project isn't found
                )}
              </div>
            )}


          </CardContent>
        </Card>
      </div>
    </div>

  )
}

