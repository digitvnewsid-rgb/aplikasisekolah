import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

interface WhatsAppPayload {
  recipient_phone: string;
  message: string;
  related_type?: string;
  related_id?: string;
}

serve(async (req) => {
  // CORS Headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const whatsappApiKey = Deno.env.get('WHATSAPP_GATEWAY_API_KEY') ?? 'DEMO_KEY_2026';
    const whatsappApiUrl = Deno.env.get('WHATSAPP_GATEWAY_URL') ?? 'https://api.whatsapp-gateway-demo.com/v1/messages';

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload: WhatsAppPayload = await req.json();
    const { recipient_phone, message, related_type, related_id } = payload;

    if (!recipient_phone || !message) {
      return new Response(
        JSON.stringify({ error: 'recipient_phone and message are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 1. Catat ke tabel whatsapp_notifications dengan status 'pending'
    const { data: notification, error: insertError } = await supabase
      .from('whatsapp_notifications')
      .insert({
        recipient_phone,
        message,
        status: 'pending',
        related_type,
        related_id,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting notification log:', insertError);
    }

    // 2. Kirim permintaan ke WhatsApp Gateway API eksternal
    let status = 'sent';
    try {
      const waResponse = await fetch(whatsappApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${whatsappApiKey}`,
        },
        body: JSON.stringify({
          phone: recipient_phone,
          text: message,
        }),
      });

      if (!waResponse.ok) {
        status = 'failed';
        console.error('WhatsApp Gateway returned error status:', waResponse.status);
      }
    } catch (waErr) {
      status = 'failed';
      console.error('Failed to reach WhatsApp Gateway:', waErr);
    }

    // 3. Perbarui status di tabel whatsapp_notifications
    if (notification) {
      await supabase
        .from('whatsapp_notifications')
        .update({ status, sent_at: new Date().toISOString() })
        .eq('id', notification.id);
    }

    return new Response(
      JSON.stringify({ success: true, status, recipient_phone, message }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Edge function error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
