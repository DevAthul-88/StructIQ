import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ProjectMaterials({ materials }) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Materials</CardTitle>
      </CardHeader>
      <CardContent>
        {materials.length === 0 ? (
          <p className="text-sm text-muted-foreground">No materials available</p>
        ) : (
          <ul className="divide-y divide-border">
            {materials.map((material) => (
              <li key={material.id} className="py-4">
                <h3 className="text-sm font-medium text-foreground">{material.type}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{material.properties}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
