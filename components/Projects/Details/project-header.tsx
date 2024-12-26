import { Badge } from "@/components/ui/badge"

export function ProjectHeader({ project }) {

  function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground">{project.projectName}</h1>
      <div className="mt-2 flex items-center space-x-4">
        <Badge variant="outline">{project.projectType}</Badge>
        <span className="text-sm text-muted-foreground">Client: {project.clientName}</span>
      </div>
      <div className="mt-4 flex items-center space-x-4">
        <Badge variant="secondary">{project.projectStatus}</Badge>
        <span className="text-sm text-muted-foreground">
          {formatDate(project.startDate)} - {formatDate(project.endDate)}
        </span>
      </div>
    </div>
  )
}

