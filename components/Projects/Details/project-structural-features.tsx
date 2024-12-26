import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ProjectStructuralFeatures({ features }) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Structural Features</CardTitle>
      </CardHeader>
      <CardContent>
        {features.length === 0 ? (
          <p className="text-sm text-muted-foreground">No structural features available</p>
        ) : (
          <ul className="divide-y divide-border">
            {features.map((feature) => (
              <li key={feature.id} className="py-4">
                <h3 className="text-sm font-medium text-foreground">{feature.type}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                {feature.quantity && (
                  <p className="mt-1 text-sm text-muted-foreground">Quantity: {feature.quantity}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}


