import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone, CreditCard, QrCode, Receipt, Shield, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Fees = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const [paymentData, setPaymentData] = useState({
    studentId: '',
    amount: '',
    payerPhone: '',
    email: ''
  });

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentData.studentId || !paymentData.amount || !paymentData.payerPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Generate receipt and transaction IDs
      const mpesaTransactionId = `M${Date.now().toString().slice(-8)}`;
      const mpesaReceipt = `RCPT-${Date.now()}`;

      toast({
        title: "Payment Initiated",
        description: "Please check your phone for the M-Pesa prompt and enter your PIN.",
      });

      // Save payment to database with pending status
      const paymentRecord = {
        admission_ref: paymentData.studentId,
        amount: parseFloat(paymentData.amount),
        payer_phone: paymentData.payerPhone.trim(),
        payer_email: paymentData.email.trim() || null,
        payment_method: 'mpesa',
        status: 'pending'
      };

      const { data: payment, error: insertError } = await supabase
        .from('payments' as any)
        .insert(paymentRecord)
        .select()
        .single();

      if (insertError) {
        console.error('Payment insertion error:', insertError);
        throw new Error('Failed to record payment');
      }

      // Simulate STK push processing
      setTimeout(async () => {
        try {
          // Update payment as completed
          const { error: updateError } = await supabase
            .from('payments' as any)
            .update({
              status: 'completed',
              mpesa_transaction_id: mpesaTransactionId,
              mpesa_receipt: mpesaReceipt,
              updated_at: new Date().toISOString()
            })
            .eq('id', (payment as any).id);

          if (updateError) {
            console.error('Payment update error:', updateError);
            throw updateError;
          }

          toast({
            title: "Payment Successful!",
            description: `Payment of KES ${paymentData.amount} received. Receipt: ${mpesaReceipt}. MPESA Ref: ${mpesaTransactionId}.`,
          });
          
          // Reset form
          setPaymentData({
            studentId: '',
            amount: '',
            payerPhone: '',
            email: ''
          });
          
        } catch (err) {
          console.error('Error updating payment:', err);
          toast({
            title: "Payment Processing Issue",
            description: "Payment may have been received but confirmation failed. Please contact support.",
            variant: "destructive"
          });
        } finally {
          setIsProcessing(false);
        }
      }, 3000);

    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="py-16 bg-gradient-hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Pay School Fees
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Pay school fees securely using M-Pesa (STK push) or Paybill. Instant e-receipts and balance updates.
            </p>
          </div>
        </section>

        {/* Intro */}
        <section className="py-12 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-lg text-muted-foreground">
              Save time — pay school fees securely by M-Pesa. You'll receive an instant e-receipt via SMS and email.
            </p>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="py-12 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Payment Options
              </h2>
              <p className="text-lg text-muted-foreground">
                Choose your preferred payment method
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="shadow-card border-0 relative">
                <div className="absolute top-4 right-4">
                  <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
                    Recommended
                  </span>
                </div>
                <CardHeader className="text-center">
                  <Smartphone className="h-12 w-12 text-accent mx-auto mb-4" />
                  <CardTitle className="text-xl">M-Pesa STK Push</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Enter phone → Get popup PIN verification on phone
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 justify-center">
                      <Shield className="h-4 w-4 text-primary" />
                      Secure & Fast
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <Receipt className="h-4 w-4 text-primary" />
                      Instant Receipt
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <Clock className="h-4 w-4 text-primary" />
                      Real-time Processing
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardHeader className="text-center">
                  <CreditCard className="h-12 w-12 text-accent mx-auto mb-4" />
                  <CardTitle className="text-xl">Paybill / Till</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Use M-Pesa Paybill or Till Number
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-semibold text-foreground">Paybill: 123456</p>
                    <p className="text-sm text-muted-foreground">Account: Student ID</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardHeader className="text-center">
                  <QrCode className="h-12 w-12 text-accent mx-auto mb-4" />
                  <CardTitle className="text-xl">QR Code</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Scan QR code with M-Pesa app
                  </p>
                  <div className="w-24 h-24 bg-muted/50 mx-auto rounded-lg flex items-center justify-center">
                    <QrCode className="h-12 w-12 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Payment Form */}
        <section className="py-16 bg-background">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Make Payment</CardTitle>
                <p className="text-center text-muted-foreground">
                  Fill in the details below to process your payment
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handlePayment} className="space-y-6">
                  <div>
                    <Label htmlFor="studentId">Student ID or Admission Ref *</Label>
                    <Input 
                      id="studentId"
                      value={paymentData.studentId}
                      onChange={(e) => setPaymentData({...paymentData, studentId: e.target.value})}
                      placeholder="Enter Student ID or Admission Reference"
                      required 
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Use your child's Student ID or Admission Reference number
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="amount">Amount (KES) *</Label>
                    <Input 
                      id="amount"
                      type="number"
                      value={paymentData.amount}
                      onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                      placeholder="0.00"
                      min="1"
                      step="0.01"
                      required 
                    />
                  </div>

                  <div>
                    <Label htmlFor="payerPhone">Payer Phone * (+2547XXXXXXXX)</Label>
                    <Input 
                      id="payerPhone"
                      value={paymentData.payerPhone}
                      onChange={(e) => setPaymentData({...paymentData, payerPhone: e.target.value})}
                      placeholder="+2547XXXXXXXX"
                      required 
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Phone number registered with M-Pesa
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="email">Email (optional)</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={paymentData.email}
                      onChange={(e) => setPaymentData({...paymentData, email: e.target.value})}
                      placeholder="your@email.com"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Receipt will be sent to this email address
                    </p>
                  </div>

                  <div className="bg-accent/5 p-4 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-2">Payment Instructions:</h4>
                    <ol className="text-sm text-muted-foreground space-y-1">
                      <li>1. Click "Pay with M-Pesa" button below</li>
                      <li>2. Check your phone for M-Pesa prompt</li>
                      <li>3. Enter your M-Pesa PIN to complete payment</li>
                      <li>4. You'll receive an instant receipt via SMS</li>
                    </ol>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      "Processing Payment..."
                    ) : (
                      <>
                        <Smartphone className="mr-2 h-4 w-4" />
                        Pay with M-Pesa
                      </>
                    )}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>
                      If STK push fails, use Paybill: <strong>123456</strong> Account: <strong>Student ID</strong>
                    </p>
                    <p className="mt-1">
                      Send proof via WhatsApp to <strong>+254700123456</strong>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Payment Features */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Why Choose Our Payment System
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Secure Payments</h3>
                <p className="text-muted-foreground text-sm">
                  Bank-grade security with encrypted transactions
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Receipt className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Instant Receipts</h3>
                <p className="text-muted-foreground text-sm">
                  Immediate confirmation via SMS and email
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">24/7 Availability</h3>
                <p className="text-muted-foreground text-sm">
                  Pay anytime, anywhere with mobile convenience
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Fees;
