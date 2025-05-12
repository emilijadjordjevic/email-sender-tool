const nodemailer = require('nodemailer');
const { db } = require('./connect');
require('dotenv').config(); 

const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    }
});

function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
}

const delay = ms => new Promise(res => setTimeout(res, ms));

const sendEmails1 = async () => {
    try {
      const res = await db.query(`SELECT email FROM email_status WHERE email LIKE '%2022%'`);
      const emails = res.rows.map(row => row.email);
  
      const batches = chunkArray(emails, 60); // Split into batches of 90 emails
  
      for (const batch of batches) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER, 
          bcc: batch.join(', '), 
          subject: 'Test Email for 2022',
          text: 'Hello, this is a test email sent to 2022 addresses!',
        };
  
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        await delay(2000); 
      }
  
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      console.log('Finished sending emails.');
    }
};

module.exports = { sendEmails1 };