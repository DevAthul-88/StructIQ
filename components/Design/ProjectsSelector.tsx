import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { Skeleton } from "../ui/skeleton";

interface Project {
  value: string;
  label: string;
  type: string;
  dimensions: string;
}

interface ProjectSelectorProps {
  selectedProject: string | null;
  setSelectedProject: (value: string | null) => void;
  error: string | null;
}


export default function ProjectSelector({ selectedProject, setSelectedProject, error, setProjectsNew }: ProjectSelectorProps) {

  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error1, setError1] = React.useState<string | null>(null);
  const { data: session } = useSession();
  const user = session?.user;

  const fetchProjects = async () => {
    setLoading(true);
    setError1(null);
    try {

      const response = await axios.get(
        `/api/projects/list/${user?.id}`
      );
      setProjects(response.data.data);
      setProjectsNew(response.data.data);
       

    } catch (err) {
      setError1(
        err.response?.data?.error ||
        'An unexpected error occurred while fetching projects'
      );
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial and filtered fetch
  React.useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);


  return (
    <>
      {loading == true ? <Skeleton className="h-[45px] w-full rounded-xl" /> : <>
        <div className="space-y-2">
          <Label htmlFor="projectSelect" className="text-lg font-medium">Project Selector</Label>
          <Select
            onValueChange={(value) => setSelectedProject(value)}
            value={selectedProject || ""}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select project..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.projectName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          

        </div>
      </>}
    </>
  )
}
