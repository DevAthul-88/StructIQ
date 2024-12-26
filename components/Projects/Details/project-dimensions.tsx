import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ProjectDimensions({ dimensions }) {
  let unites = dimensions?.units.split(' ')
  const newArray = unites.map(str => str.split(',').join(''));
  
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Dimensions</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Length</dt>
            <dd className="mt-1 text-sm text-foreground capitalize">{dimensions.length} {newArray[0]}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Width</dt>
            <dd className="mt-1 text-sm text-foreground capitalize">{dimensions.width} {newArray[1]}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Height</dt>
            <dd className="mt-1 text-sm text-foreground capitalize">{dimensions.height} {newArray[2]}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}

