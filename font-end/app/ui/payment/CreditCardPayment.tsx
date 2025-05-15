"use client"

import type React from "react"

import { useState } from "react"
import { CreditCard, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner";

//khai báo type để truyền data từ con lên cha
interface CreditCardPaymentProps {
  onPaymentSuccess: (data: any) => void;
}

type TPaymentResponse = {
  transactionId: string,
  gateway: string,
  method: string,
  metadata: object
}

type TPaymentData = {
  type: string,
  gateway: string,
  accountNumber: string,
  expiryDate: Date,
  cardholderName: string,
  isDefault: boolean,
  transactionId: string
}

export default function CreditCardPayment({onPaymentSuccess}: CreditCardPaymentProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryMonth, setExpiryMonth] = useState("")
  const [expiryYear, setExpiryYear] = useState("")
  const [cvv, setCvv] = useState("")
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // --------------- Begin Chuyển đổi thành Date--------------- //
const convertToDate = (month: string, year: string): Date | null => {
  if (month && year) {
    // Tạo Date có định dạng YYYY-MM (tháng bắt đầu từ 0 nên cần trừ 1)
    const dateString = `${year}-${month.padStart(2, '0')}-01`;
    const date = new Date(dateString);

    // Kiểm tra nếu ngày hợp lệ
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  return null; // Trả về null nếu không hợp lệ
};
  // ---------------End Chuyển đổi thành Date--------------- //

  // ---------Begin Validate input trước khi thanh toán-----------//
  const validatePayment = (): boolean => {
    const errorList: string[] = [];

    // Kiểm tra số thẻ (16 chữ số, không có khoảng trắng)
    const cardDigits = cardNumber.replace(/\s/g, "");
    if (cardDigits.length !== 16 || !/^\d+$/.test(cardDigits)) {
      errorList.push("Số thẻ phải có 16 chữ số.");
    }

    // Kiểm tra tên chủ thẻ
    if (!cardName.trim()) {
      errorList.push("Tên chủ thẻ không được để trống.");
    }

    // Kiểm tra ngày hết hạn
    const expiryDate = convertToDate(expiryMonth, expiryYear);
    const currentDate = new Date();
    if (!expiryDate || expiryDate < currentDate) {
      errorList.push("Ngày hết hạn không hợp lệ.");
    }

    // Kiểm tra CVV (3-4 chữ số)
    if (cvv.length < 3 || cvv.length > 4 || !/^\d+$/.test(cvv)) {
      errorList.push("CVV phải có 3-4 chữ số.");
    }

    setErrors(errorList);
    return errorList.length === 0;
  };
  // ---------end Validate input trước khi thanh toán-----------//

  // Xử lý thanh toán
  const handlePayment = async () => {
    if (!validatePayment()) return;

    setIsProcessing(true);

    try {
      //Giả sử nhận được 1 response từ cổng thanh toán
      const paymentResponse = {
        transactionId: "credit_card_123456789",
        gateway: "Stripe",
        method: "credit_card",
        metadata: {cardType: "Visa"}
      };

      //Lưu data vào PaymentData
      const PaymentData = {
        type: paymentResponse.method,
        gateway: paymentResponse.gateway,
        accountNumber: cardNumber,
        expiryDate: convertToDate(expiryMonth, expiryYear),
        cardholderName: cardName,
        isDefault: true,
        transactionId: paymentResponse.transactionId,
        metadata: paymentResponse.metadata
      }
      //Truyền lên paymentComponent
      onPaymentSuccess(PaymentData);
      //Thông báo & khóa nút thanh toán
        toast.success('Bạn đã thanh toán thành công');
    } catch (error) {
      toast.error('Thanh toán thất bại, kiểm tra lại thông tin thanh toán');
      setIsProcessing(false);
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setCardNumber(formatted)
  }

  // Generate month options
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    return (
      <SelectItem key={month} value={month.toString().padStart(2, "0")}>
        {month.toString().padStart(2, "0")}
      </SelectItem>
    )
  })

  // Generate year options (current year + 10 years)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 11 }, (_, i) => {
    const year = currentYear + i
    return (
      <SelectItem key={year} value={year.toString()}>
        {year}
      </SelectItem>
    )
  })

  return (
    <div className="space-y-6">
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold">Credit Card</div>
            <CreditCard className="h-6 w-6" />
          </div>
          <div className="h-10 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-md mb-4">
            <div className="text-2xl text-gray-700 font-mono h-full flex items-center">
              {cardNumber || "•••• •••• •••• ••••"}
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <div className="text-xs">
              <div className="text-muted-foreground">Card Holder</div>
              <div>{cardName || "YOUR NAME"}</div>
            </div>
            <div className="text-xs">
              <div className="text-muted-foreground">Expires</div>
              <div>
                {expiryMonth || "MM"}/{expiryYear?.substring(2) || "YY"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {errors.length > 0 && (
        <div className="text-red-500 space-y-2">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
        <div className="grid gap-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={handleCardNumberChange}
            maxLength={19}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="cardName">Cardholder Name</Label>
          <Input id="cardName" placeholder="John Doe" value={cardName} onChange={(e) => setCardName(e.target.value)} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="expiryMonth">Month</Label>
            <Select value={expiryMonth} onValueChange={setExpiryMonth}>
              <SelectTrigger id="expiryMonth">
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent>{months}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="expiryYear">Year</Label>
            <Select value={expiryYear} onValueChange={setExpiryYear}>
              <SelectTrigger id="expiryYear">
                <SelectValue placeholder="YYYY" />
              </SelectTrigger>
              <SelectContent>{years}</SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
              maxLength={4}
              type="password"
            />
          </div>
          {/* Button thanh toán */}
          <Button
          type="button" 
          className="w-full mt-4 cursor-pointer" 
          onClick={handlePayment}
          disabled={isProcessing}
          >
            {isProcessing ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
              Thanh toán thành công
            </>
            ) : (
              "Thanh toán"
            )}
          </Button>
        </div>
      </div>
  )
}
