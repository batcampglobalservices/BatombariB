import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  try {
    // Create transporter using Gmail or other email service
    // You'll need to set up environment variables for this
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASSWORD, // Your Gmail app password
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'bakpobatombari@gmail.com', // Your email where you want to receive messages
      subject: `Portfolio Contact Form: Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
            <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">New Contact Form Submission</h2>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #555; margin-bottom: 10px;">Contact Details:</h3>
              <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            </div>
            
            <div style="margin: 20px 0;">
              <h3 style="color: #555; margin-bottom: 10px;">Message:</h3>
              <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; border-radius: 5px;">
                <p style="color: #333; line-height: 1.6; margin: 0;">${message}</p>
              </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #777; font-size: 12px; margin: 0;">This message was sent from your portfolio contact form.</p>
            </div>
          </div>
        </div>
      `,
      replyTo: email, // Allow you to reply directly to the sender
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully!' 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again later.' 
    });
  }
}
