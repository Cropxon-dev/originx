import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PublisherRequestPayload {
  name: string;
  email: string;
  company: string;
  apiDescription: string;
  useCase: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, company, apiDescription, useCase }: PublisherRequestPayload = await req.json();

    console.log("Received publisher request:", { name, email, company });

    // Send email to sales team
    const salesEmailResponse = await resend.emails.send({
      from: "OriginX <onboarding@resend.dev>",
      to: ["sales@originxcloud.com"],
      subject: `New Publisher Request from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f7; padding: 40px 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
            h1 { color: #1d1d1f; font-size: 24px; margin-bottom: 24px; }
            .field { margin-bottom: 20px; }
            .label { color: #86868b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
            .value { color: #1d1d1f; font-size: 16px; }
            .footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e5e7; color: #86868b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🚀 New Publisher Request</h1>
            
            <div class="field">
              <div class="label">Name</div>
              <div class="value">${name}</div>
            </div>
            
            <div class="field">
              <div class="label">Email</div>
              <div class="value">${email}</div>
            </div>
            
            <div class="field">
              <div class="label">Company</div>
              <div class="value">${company || 'Not provided'}</div>
            </div>
            
            <div class="field">
              <div class="label">API Description</div>
              <div class="value">${apiDescription}</div>
            </div>
            
            <div class="field">
              <div class="label">Use Case</div>
              <div class="value">${useCase || 'Not provided'}</div>
            </div>
            
            <div class="footer">
              This request was submitted via OriginX Publisher Portal.
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Sales email sent:", salesEmailResponse);

    // Send confirmation email to the requester
    const confirmationEmailResponse = await resend.emails.send({
      from: "OriginX <onboarding@resend.dev>",
      to: [email],
      subject: "We received your Publisher Application - OriginX",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f7; padding: 40px 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
            h1 { color: #1d1d1f; font-size: 28px; margin-bottom: 16px; }
            p { color: #424245; font-size: 16px; line-height: 1.6; }
            .highlight { color: #6366f1; font-weight: 600; }
            .footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e5e7; color: #86868b; font-size: 14px; }
            .logo { font-weight: 700; color: #1d1d1f; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Thank you, ${name}! 🎉</h1>
            
            <p>We're excited that you want to join <span class="highlight">OriginX</span> as a publisher!</p>
            
            <p>Our team has received your application and will review it within <strong>2-3 business days</strong>. We'll reach out to you at this email address with next steps.</p>
            
            <p>In the meantime, feel free to explore our marketplace and documentation to get familiar with the platform.</p>
            
            <p>Questions? Reply to this email or reach us at sales@originxcloud.com</p>
            
            <div class="footer">
              <span class="logo">OriginX</span> by Cropxon Innovations Pvt. Ltd.<br/>
              Building the future of API infrastructure.
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Confirmation email sent:", confirmationEmailResponse);

    return new Response(
      JSON.stringify({ success: true, message: "Request submitted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-publisher-request function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
