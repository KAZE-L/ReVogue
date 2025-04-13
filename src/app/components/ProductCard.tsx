import { Card, CardContent } from '@/app/components/ui/card'

export default function ProductCard() {
  return (
    <Card>
      <div className="aspect-square bg-gray-200" />
      <CardContent className="p-2">
        <div className="text-sm mt-2">Logo印花圓領短袖T恤-白色</div>
        <div className="text-sm text-gray-500">NT $650</div>
      </CardContent>
    </Card>
  )
}
