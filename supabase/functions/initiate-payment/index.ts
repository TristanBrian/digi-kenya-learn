import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { studentId, amount, payerPhone, payerEmail } = await req.json();
    
    // Generate payment reference
    const paymentRef = `PAY${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const mpesaReceipt = `MOCK${Math.random().toString(36).substring(2, 15).toUpperCase()}`;
    
    // Simulate M-Pesa STK Push (for MVP demo)
    // In production, this would integrate with Daraja API
    const mockStkResponse = {
      MerchantRequestID: `mock-merchant-${Date.now()}`,
      CheckoutRequestID: `mock-checkout-${Date.now()}`,
      ResponseCode: "0",
      ResponseDescription: "Success. Request accepted for processing",
      CustomerMessage: "Success. Request accepted for processing"
    };

    // Insert payment record
    const { data, error } = await supabase
      .from('payments')
      .insert({
        school_id: '123e4567-e89b-12d3-a456-426614174000', // Demo school ID
        student_id: studentId,
        amount: parseFloat(amount),
        payer_phone: payerPhone,
        payer_email: payerEmail,
        payment_method: 'mpesa',
        status: 'pending',
        merchant_request_id: mockStkResponse.MerchantRequestID,
        checkout_request_id: mockStkResponse.CheckoutRequestID,
        mpesa_receipt: mpesaReceipt
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    // Simulate success after 3 seconds (for demo)
    setTimeout(async () => {
      await supabase
        .from('payments')
        .update({ 
          status: 'completed',
          mpesa_transaction_id: mpesaReceipt 
        })
        .eq('id', data.id);
    }, 3000);

    console.log('Payment initiated:', data);

    return new Response(
      JSON.stringify({ 
        success: true,
        payment_id: data.id,
        checkout_request_id: mockStkResponse.CheckoutRequestID,
        message: 'STK Push sent to your phone. Complete payment using your M-Pesa PIN.'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});