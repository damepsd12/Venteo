// // 📁 /utils/emailService.js
// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST, // changé de "service" vers "host"
//   port: process.env.EMAIL_PORT, // spécifie bien le port
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const sendApprovalEmail = async (toEmail, name) => {
//   const mailOptions = {
//     from: `"Venteo" <${process.env.EMAIL_USER}>`, // optionnel mais plus propre
//     to: toEmail,
//     subject: "Votre compte vendeur a été approuvé",
//     html: `<p>Bonjour <strong>${name}</strong>,</p>
//            <p>Félicitations ! Votre demande pour devenir vendeur a été approuvée avec succès.</p>
//            <p>Vous pouvez maintenant vous connecter à votre compte sur Venteo.</p>
//            <p>À bientôt !</p>`,
//   };

//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendApprovalEmail;


// 📁 /utils/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendApprovalEmail = async (toEmail, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Votre compte vendeur a été approuvé",
    html: `<p>Bonjour <strong>${name}</strong>,</p>
           <p>Félicitations ! Votre demande pour devenir vendeur a été approuvée avec succès.</p>
           <p>Vous pouvez maintenant vous connecter à votre compte sur Venteo.</p>
           <p>À bientôt !</p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendApprovalEmail;
