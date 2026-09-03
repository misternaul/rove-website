import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'ROVE Studio <hello@rovepresence.com>'; // Replace with verified domain in production

export async function sendWaitlistConfirmation(email: string) {
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: 'ROVE: Waitlist Allocation Secured',
      html: `
        <div style="font-family: monospace; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #FAFAFA; color: #000000; border: 1px solid #EAEAEA;">
          <h2 style="font-family: serif; font-weight: 300; letter-spacing: -0.02em; font-size: 24px;">Allocation Secured.</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #444444;">
            Your email has been added to the ROVE Studio Waitlist. You will receive priority access and the private codex before the public release.
          </p>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #EAEAEA;">
            <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #888888;">
              Less Noise. More Presence.<br/>
              ROVE Design Studio
            </p>
          </div>
        </div>
      `
    });
    return { success: true, data };
  } catch (error) {
    console.error('Resend Error:', error);
    return { success: false, error };
  }
}

export async function sendOrderConfirmation(email: string, orderNumber: string, totalAmount: number) {
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: `ROVE: Order Confirmation [${orderNumber}]`,
      html: `
        <div style="font-family: monospace; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #FAFAFA; color: #000000; border: 1px solid #EAEAEA;">
          <h2 style="font-family: serif; font-weight: 300; letter-spacing: -0.02em; font-size: 24px;">Acquisition Confirmed.</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #444444;">
            Order <strong>${orderNumber}</strong> has been successfully processed. 
            Your total allocation comes to <strong>PKR ${totalAmount.toLocaleString()}</strong>.
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #444444;">
            We are preparing your garments for shipment. You will receive another notification with tracking details once dispatched.
          </p>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #EAEAEA;">
            <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #888888;">
              Less Noise. More Presence.<br/>
              ROVE Design Studio
            </p>
          </div>
        </div>
      `
    });
    return { success: true, data };
  } catch (error) {
    console.error('Resend Error:', error);
    return { success: false, error };
  }
}
