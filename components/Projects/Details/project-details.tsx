import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ProjectDetails({ project }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Budget</dt>
            <dd className="mt-1 text-sm text-foreground">${project.budget?.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Architectural Style</dt>
            <dd className="mt-1 text-sm text-foreground">{project.architecturalStyle}</dd>
          </div>
        </dl>
        <div className="mt-6">
          <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
          <p className="mt-1 text-sm text-foreground">{project.description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

