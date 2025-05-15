import { Truck } from "lucide-react"

export default function CodPayment() {
  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-6 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="bg-green-100 text-green-700 p-2 rounded-full">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Cash on Delivery</h3>
            <p className="text-sm text-muted-foreground">Thanh toán bằng tiền mặt khi nhận hàng.</p>
          </div>
        </div>
      </div>
    </div>
  )
}