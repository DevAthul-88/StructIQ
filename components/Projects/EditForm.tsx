'use client'

import { useEffect, useState } from 'react'
import { useFieldArray, useForm, useFormState } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { CalendarIcon, PlusCircle, HelpCircle, Loader2, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AddManagerModal } from './AddManagerModal'
import axios from 'axios'
import { Textarea } from '../ui/textarea'
import { architecturalStyleOptions, layoutTypeOptions, managedProjectSchema, materialTypeOptions, projectStatusOptions, projectTypeOptions, structuralFeatureOptions, unitOptions } from '@/types/managed-project'

type FormData = {
    projectName: string
    projectType: string
    clientName: string
    projectManager: string
    startDate: Date
    endDate: Date
    budget: string
    projectStatus: string
}

export function EditProjectForm({ project }: object) {

    let unites = project?.dimensions?.units.split(' ')
    const newArray = unites.map(str => str.split(',').join(''));
 console.log(project);
 

    const form = useForm({
        resolver: zodResolver(managedProjectSchema),
        defaultValues: {
            id: project?.id,
            projectName: project.projectName ?? '',
            clientName: project.clientName ?? '',
            budget: project.budget ?? 0,
            materials: project.materials ?? [{ type: "Concrete", properties: "" }],
            structuralFeatures: project.structuralFeatures ?? [{ type: "Beam", description: "", quantity: 1 }],
            projectType: project.projectType ?? 'Industrial',
            startDate: project.startDate ? new Date(project.startDate) : new Date(),
            endDate: project.endDate ? new Date(project.endDate) : new Date(),
            projectStatus: project.projectStatus ?? 'Planning',
            description: project.description ?? '',
            length: project.dimension?.length ?? 0,
            lengthUnit: newArray[0] ?? "meters",
            width: project.dimension?.width ?? 0,
            widthUnit: newArray[1] ?? "meters",
            height: project.dimension?.height ?? 0,
            heightUnit: newArray[2] ?? "meters",
            preferredLayoutType: project.layoutPreferences?.[0]?.type ?? 'Open Plan',
            layoutDescription: project.layoutPreferences?.[0]?.description ?? '',
            architecturalStyle: project.architecturalStyle ?? 'Modern',
            projectManager: project.manager?.id ?? ''
        }
    });



    const [projectManagers, setProjectManagers] = useState([])
    const [isAddManagerModalOpen, setIsAddManagerModalOpen] = useState(false)
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {

        const fetchManagers = async () => {
            try {
                const response = await axios.get('/api/projects/managers');
                setProjectManagers(response.data);
            } catch (err) {
                setError('Failed to fetch managers');
                toast.info(`We're still working on the search.`)
            } finally {
                setLoading(false);
            }
        };

        fetchManagers();
    }, []);

    const onSubmit = async (data: FormData) => {
        setLoading1(true);

        try {

            const response = await axios.put(`/api/projects/edit/${project?.id}`, data);

            toast.info('Your project has been successfully edited.');


        } catch (error) {
            console.error('Error editing project:', error);
            toast.error('Failed to edit project. Please try again.');
        } finally {
            setLoading1(false);
        }
    };

    const handleAddManager = async (managerName) => {
        setLoading(true)
        setError(null)

        try {

            await axios.post('/api/projects/managers/create', { managerName })

            const response = await axios.get('/api/projects/managers')
            setProjectManagers(response.data)

            toast.info(`${managerName} has been added to the list of project managers.`)
            setIsAddManagerModalOpen(false);

        } catch (error) {
            toast(`Failed to add manager. Please try again later.`)
        } finally {
            setLoading(false)
        }
    }

    const { fields: materialFields, append: appendMaterial, remove: removeMaterial } = useFieldArray({
        control: form.control,
        name: "materials",
    })

    const { fields: structuralFields, append: appendStructuralFeature, remove: removeStructuralFeature } = useFieldArray({
        control: form.control,
        name: "structuralFeatures",
    })
    return (
        <TooltipProvider>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Edit Project</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold">General Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="projectName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center">
                                                    Project Name
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <HelpCircle className="h-4 w-4 ml-2" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Enter the name of your project</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="projectType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center">
                                                    Project Type
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <HelpCircle className="h-4 w-4 ml-2" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Select the type of your project</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Project Type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {projectTypeOptions.map((type) => (
                                                            <SelectItem key={type} value={type}>
                                                                {type}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="clientName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center">
                                                    Client Name
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <HelpCircle className="h-4 w-4 ml-2" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Enter the name of the client</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="projectManager"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center">
                                                    Project Manager
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <HelpCircle className="h-4 w-4 ml-2" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Select or add a project manager</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </FormLabel>
                                                <div className="flex items-center space-x-2">
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select project manager" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {projectManagers.length === 0 ? (
                                                                <p className='p-2 text-center'>No managers available</p>
                                                            ) : (
                                                                projectManagers.map((manager) => (
                                                                    <SelectItem key={manager.id} value={manager.id}>
                                                                        {manager.name}
                                                                    </SelectItem>
                                                                ))
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => setIsAddManagerModalOpen(true)}
                                                            >
                                                                <PlusCircle className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Add a new project manager</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="startDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel className="flex items-center">
                                                    Start Date
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <HelpCircle className="h-4 w-4 ml-2" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Select the project start date</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date > new Date() || date < new Date("1900-01-01")
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="endDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel className="flex items-center">
                                                    End Date
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <HelpCircle className="h-4 w-4 ml-2" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Select the project end date</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date < new Date("1900-01-01")
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="budget"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center">
                                                    Budget
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <HelpCircle className="h-4 w-4 ml-2" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Enter the project budget</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="projectStatus"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center">
                                                    Project Status
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <HelpCircle className="h-4 w-4 ml-2" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Select the current status of the project</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Project Status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {projectStatusOptions.map((status) => (
                                                            <SelectItem key={status} value={status}>
                                                                {status}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold">Description</h2>
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center">
                                                Project Description
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <HelpCircle className="h-4 w-4 ml-2" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Provide a detailed description of the project</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold">Dimensions</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {['length', 'width', 'height'].map((dimension) => (
                                        <div key={dimension} className="space-y-2">
                                            <FormField
                                                control={form.control}
                                                name={dimension as "length" | "width" | "height"}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center capitalize">
                                                            {dimension}
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <HelpCircle className="h-4 w-4 ml-2" />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Enter the {dimension} of the project</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`${dimension}Unit` as "lengthUnit" | "widthUnit" | "heightUnit"}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select Unit" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {unitOptions.map((unit) => (
                                                                    <SelectItem key={unit} value={unit}>
                                                                        {unit}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold">Layout Preferences</h2>
                                <FormField
                                    control={form.control}
                                    name="preferredLayoutType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center">
                                                Preferred Layout Type
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <HelpCircle className="h-4 w-4 ml-2" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Select your preferred layout type</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Preferred Layout Type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {layoutTypeOptions.map((type) => (
                                                        <SelectItem key={type} value={type}>
                                                            {type}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="layoutDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center">
                                                Layout Description
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <HelpCircle className="h-4 w-4 ml-2" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Provide a detailed description of the layout</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold">Materials</h2>
                                {materialFields.map((field, index) => (
                                    <div key={field.id} className="flex space-x-4 items-end">
                                        <FormField
                                            control={form.control}
                                            name={`materials.${index}.type`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel className="flex items-center">
                                                        Material Type
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <HelpCircle className="h-4 w-4 ml-2" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Select the type of material</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Material Type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {materialTypeOptions.map((type) => (
                                                                <SelectItem key={type} value={type}>
                                                                    {type}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`materials.${index}.properties`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel className="flex items-center">
                                                        Properties
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <HelpCircle className="h-4 w-4 ml-2" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Enter the properties of the material</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeMaterial(index)}
                                            className="flex-shrink-0"
                                            aria-label={`Remove material ${index + 1}`}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    onClick={() => appendMaterial({ type: "Concrete", properties: "" })}
                                >
                                    Add Another Material
                                </Button>
                            </div>


                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold">Architectural Style</h2>
                                <FormField
                                    control={form.control}
                                    name="architecturalStyle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center">
                                                Architectural Style
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <HelpCircle className="h-4 w-4 ml-2" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Select the architectural style of the project</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Architectural Style" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {architecturalStyleOptions.map((style) => (
                                                        <SelectItem key={style} value={style}>
                                                            {style}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold">Structural Features</h2>
                                {structuralFields.map((field, index) => (
                                    <div key={field.id} className="space-y-2">
                                        <div className="flex space-x-4 items-end">
                                            <FormField
                                                control={form.control}
                                                name={`structuralFeatures.${index}.type`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormLabel className="flex items-center">
                                                            Feature Type
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <HelpCircle className="h-4 w-4 ml-2" />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Select the type of structural feature</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select Feature Type" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {structuralFeatureOptions.map((type) => (
                                                                    <SelectItem key={type} value={type}>
                                                                        {type}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`structuralFeatures.${index}.quantity`}
                                                render={({ field }) => (
                                                    <FormItem className="flex-1">
                                                        <FormLabel className="flex items-center">
                                                            Quantity
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <HelpCircle className="h-4 w-4 ml-2" />
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Enter the quantity of this structural feature</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={() => removeStructuralFeature(index)}
                                                className="flex-shrink-0"
                                                aria-label={`Remove structural feature ${index + 1}`}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name={`structuralFeatures.${index}.description`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center">
                                                        Description
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <HelpCircle className="h-4 w-4 ml-2" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Provide a description of the structural feature</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    onClick={() => appendStructuralFeature({ type: "Beam", description: "", quantity: 1 })}
                                >
                                    Add Another Structural Feature
                                </Button>
                            </div>

                            <AddManagerModal
                                isOpen={isAddManagerModalOpen}
                                onClose={() => setIsAddManagerModalOpen(false)}
                                onAdd={handleAddManager}
                            />
                            <Button type="submit" disabled={loading1}>{loading1 && <Loader2 className="animate-spin" />}Submit</Button>
                        </form>
                    </Form>
                </CardContent>
                <AddManagerModal
                    isOpen={isAddManagerModalOpen}
                    onClose={() => setIsAddManagerModalOpen(false)}
                    onAddManager={handleAddManager}
                    loading={loading}
                />
            </Card>
        </TooltipProvider>
    )
}

