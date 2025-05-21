import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { redirectToCheckout } from '@/lib/stripe';
import { toast } from 'sonner';

interface PaymentButtonProps {
  paymentLink: string;
  className?: string;
  children?: React.ReactNode;
}

export function PaymentButton({ paymentLink, className, children }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      await redirectToCheckout(paymentLink);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      className={className}
    >
      {loading ? 'Processing...' : children || 'Pay Now'}
    </Button>
  );
} 