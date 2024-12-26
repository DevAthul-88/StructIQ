import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ProjectLayouts({ layouts }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Layout Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-border">
          {layouts.map((layout) => (
            <li key={layout.id} className="py-4">
              <h3 className="text-sm font-medium text-foreground">{layout.type}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{layout.description}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

