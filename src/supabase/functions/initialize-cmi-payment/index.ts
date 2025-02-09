
// @deno-types="https://deno.land/std@0.208.0/http/server.ts"
import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { carId, amount, carName } = await req.json()
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      // Use type assertion for Deno.env
      (Deno.env.get('SUPABASE_URL') ?? '') as string,
      (Deno.env.get('SUPABASE_ANON_KEY') ?? '') as string
    )

    // Generate a unique order ID
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substring(7)}`

    // Store the transaction in the database
    const { data: transaction, error: transactionError } = await supabaseClient
      .from('transactions')
      .insert({
        car_id: carId,
        amount: amount,
        status: 'pending',
        order_id: orderId,
        type: 'sale'
      })
      .select()
      .single()

    if (transactionError) throw transactionError

    // CMI merchant ID and other configuration would come from environment variables
    const merchantId = Deno.env.get('CMI_MERCHANT_ID') as string
    const cmiEndpoint = Deno.env.get('CMI_ENDPOINT') as string

    if (!merchantId || !cmiEndpoint) {
      throw new Error('CMI configuration missing')
    }

    // Construct CMI payment URL with required parameters
    const redirectUrl = `${cmiEndpoint}?` + new URLSearchParams({
      merchantId: merchantId,
      amount: amount.toString(),
      orderId: orderId,
      itemName: carName,
      currency: 'MAD',
      // Add other required CMI parameters here
    }).toString()

    return new Response(
      JSON.stringify({
        redirectUrl,
        orderId,
        message: 'Payment initialized successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
