
// @deno-types="npm:@types/node"

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { carId, amount, carName } = await req.json()
    
    // Initialize Supabase client using direct environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabaseClient = await createClient(supabaseUrl, supabaseAnonKey);

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
    const merchantId = Deno.env.get('CMI_MERCHANT_ID')
    const cmiEndpoint = Deno.env.get('CMI_ENDPOINT')

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
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Types for Deno namespace
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (req: Request) => Promise<Response>): void;
};

declare const createClient: (url: string, key: string) => Promise<any>;
