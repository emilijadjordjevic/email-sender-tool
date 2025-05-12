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

const sendEmailsSequentially = async (subject, textContent) => {
  try {
      const res = await db.query('SELECT email FROM email_status');
      const emails = res.rows.map(row => row.email);
    for (const email of emails) {
        const mailOptions = {
          from: process.env.EMAIL_USER,  
          to: email,
          subject: subject, 
          text: textContent,
        };
  
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to: ${email}`);
        console.log('Email sent: ', info.response);
    }

  } catch (error) {
    console.error('Error sending emails:', error);
  } finally {
  //   await db.end();
    console.log('Database connection closed');
  }
};


  function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
}

const delay = ms => new Promise(res => setTimeout(res, ms));

const sendBatchEmails = async (subject, textContent) => {
    try {
      const res = await db.query(`SELECT email FROM email_status`);
      const emails = res.rows.map(row => row.email);
  
      const batches = chunkArray(emails, 90);
  
      for (const batch of batches) {
        console.log(`Sending email to batch: ${batch.join(', ')}`);

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER, 
          bcc: batch.join(', '), 
          subject: subject,
          text: textContent,
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

module.exports = { sendEmailsSequentially, sendBatchEmails };