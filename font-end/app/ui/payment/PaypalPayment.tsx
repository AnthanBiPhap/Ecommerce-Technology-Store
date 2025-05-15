"use client"

import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { useState } from "react";
import { toast } from "sonner";

//khai báo type để truyền data từ con lên cha
interface PaypalPaymentProps {
  onPaymentSuccess: (data: any) => void;
}

type TPaymentResponse = {
  transactionId: string,
  gateway: string,
  method: string,
  metadata: object,
  payer: object
}

type TPaymentData = {
  type: string,
  gateway: string,
  accountNumber: string,
  expiryDate?: Date,
  cardholderName: string,
  isDefault: boolean,
  transactionId: string
}

export default function PaypalPayment({onPaymentSuccess}: PaypalPaymentProps) {
   const [isProcessing, setIsProcessing] = useState(false);
  
  // Xử lý thanh toán
  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      //Giả sử nhận được 1 response từ cổng thanh toán
      const paymentResponse = {
        transactionId: "paypal_123456789",
        gateway: "Stripe",
        method: "paypal",
        metadata: {
          href: "https://api.paypal.com/v1/payments/payment/8N497594MU965463H",
          rel: "self",
          method: "GET"
        },
        payer: {
          payer_id: "W8E5F6J7K8L9M",
          email: "nguyendat2025@gmail.com",
          fullname: "Dat Nguyen"
        }

      };

      //Lưu data vào PaymentData
      const PaymentData = {
        type: paymentResponse.method,
        gateway: paymentResponse.gateway,
        accountNumber: paymentResponse.payer.payer_id,
        cardholderName: paymentResponse.payer.fullname,
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
  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-6 rounded-lg">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-[#0070ba] text-white p-2 rounded-full">
            <Wallet className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold">Pay with PayPal</h3>
          <p className="text-sm text-center text-muted-foreground">
            You will be redirected to PayPal to complete your payment securely.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full h-12 flex items-center justify-center gap-2 bg-[#ffc439] hover:bg-[#f0b92d] text-[#253b80] hover:text-[#253b80] border-[#ffc439] cursor-pointer"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M17.5 7H17a2 2 0 0 0-2-2h-4.5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2H17a2 2 0 0 0 2-2v-7.5" />
            <path d="M14 2v4" />
            <path d="M12 4h4" />
            <circle cx="9" cy="9" r="1" />
            <path d="m15 9-3 3-3-3" />
          </svg>
          Connect with PayPal
        </Button>

        <div className="text-xs text-center text-muted-foreground">
          By clicking the PayPal button, you agree to the PayPal terms of service and privacy policy.
        </div>
      </div>
    </div>
  )
}
