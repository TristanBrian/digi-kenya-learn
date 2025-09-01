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

    const admissionData = await req.json();
    
    // Generate admission reference
    const admissionRef = `ADM${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    // Insert admission record
    const { data, error } = await supabase
      .from('admissions')
      .insert({
        ...admissionData,
        admission_ref: admissionRef,
        school_id: '123e4567-e89b-12d3-a456-426614174000', // Demo school ID
        status: 'new'
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Admission submitted:', data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        admission_ref: admissionRef,
        message: 'Application submitted successfully'
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