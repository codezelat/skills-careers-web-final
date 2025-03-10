import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendPasswordResetEmail(email, resetUrl) {
  try {
    const mailOptions = {
      from: `Skill Careers <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a365d;">Password Reset Request</h2>
          <p>We received a request to reset your password. Click the link below to proceed:</p>
          <a href="${resetUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #2563eb; 
                    color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
            Reset Password
          </a>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 0.875rem;">
            This link will expire in 1 hour. For security reasons, do not share this link with anyone.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send password reset email');
  }
}

export async function sendStatusChangedNotification(applicationData) {
  try {
    const { jobseekerEmail, applicationId, jobTitle, status } = applicationData;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: jobseekerEmail,
      subject: "Application Status Notification",
      html: `
        <h2>Your application for ${jobTitle}</h2>
        <p>Your application for ${jobTitle} has been ${status}</p>
        <ul>
          <li><strong>Application ID:</strong> ${applicationId}</li>
          <li><strong>Job Title Name:</strong> ${jobTitle}</li>
          <li><strong>Status:</strong> ${status}</li>
        </ul>
        <p>Please review this application in your dashboard.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}

export async function sendTicketEnrollmentNotification(ticketEnrollmentData) {
  try {
    const { ticketName, name, email, contactNumber } = ticketEnrollmentData;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Ticket Enrollment Notification",
      html: `
        <h2>You have sucessfully enrolled for ${ticketName}</h2>
        <p>Participant Details:</p>
        <ul>
          <li><strong> Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Contact Number:</strong> ${contactNumber}</li>
        </ul>
        <p>Please view more details in your dashboard.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}