const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

module.exports.sendValidationEmail = (user) => {
  const validateUrl = `${process.env.APP_URL}/api/v1/users/${user.id}/validate?token=${user.activateToken}`;

  return transporter.sendMail({
    from: `"UX Test Hub" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Confirma tu cuenta en UX Test Hub",
    html: `
      <h1>Hola, ${user.name}!</h1>
      <p>Gracias por registrarte en UX Test Hub.</p>
      <p>Por favor, confirma tu cuenta haciendo clic en el siguiente enlace:</p>
      <a href="${validateUrl}">Validar cuenta</a>
      <p>Si no has solicitado esta cuenta, ignora este correo.</p>
    `,
  });
};

module.exports.sendWelcomeEmail = (userEmail, userName) => {
  return transporter.sendMail({
    from: `"UX Test Hub" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Bienvenido a UX Test Hub!",
    html: `
      <h1>Hola, ${userName}!</h1>
      <p>Gracias por unirte a UX Test Hub.</p>
      <p>Explora y testea prototipos, deja feedback y colabora con la comunidad!</p>
      <p>💡 Si tienes dudas, contáctanos.</p>
      <p>El equipo de UX Test Hub 🚀</p>
    `,
  });
};

module.exports.sendPrototypeConfirmationEmail = (userEmail, prototype) => {
  return transporter.sendMail({
    from: `"UX Test Hub" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Tu prototipo ha sido publicado 🎉",
    text: `¡Hola! Tu prototipo "${prototype.title}" ha sido publicado en UX Test Hub.`,
    html: `<p>¡Hola! Tu prototipo <strong>${prototype.title}</strong> ha sido publicado en UX Test Hub.</p>`,
  });
};

module.exports.sendPrototypeDeletedEmail = (userEmail, prototype) => {
  return transporter.sendMail({
    from: `"UX Test Hub" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Tu prototipo ha sido eliminado ❌",
    text: `Hola, tu prototipo "${prototype.title}" ha sido eliminado de UX Test Hub.`,
    html: `<p>Hola, tu prototipo <strong>${prototype.title}</strong> ha sido eliminado de UX Test Hub.</p>`,
  });
};

module.exports.sendNewCommentEmail = (userEmail, prototype, comment) => {
  return transporter.sendMail({
    from: `"UX Test Hub" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Nuevo comentario en tu prototipo 💬",
    text: `Tu prototipo "${prototype.title}" ha recibido un nuevo comentario: "${comment.text}".`,
    html: `<p>Tu prototipo <strong>${prototype.title}</strong> ha recibido un nuevo comentario:</p>
           <blockquote>${comment.text}</blockquote>`,
  });
};

module.exports.sendReviewNotificationEmail = (userEmail, prototype) => {
  return transporter.sendMail({
    from: `"UX Test Hub" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `Tu prototipo ha sido ${prototype.status} 🚀`,
    html: `
      <h1>¡Hola!</h1>
      <p>Tu prototipo <strong>${prototype.title}</strong> ha sido <strong>${prototype.status}</strong>.</p>
      <p><strong>Feedback:</strong> ${prototype.feedback || "Sin comentarios"}</p>
      <p>Gracias por contribuir a UX Test Hub.</p>
    `,
  });
};

module.exports.sendPrototypeStatusEmail = (userEmail, prototype) => {
  return transporter.sendMail({
    from: `"UX Test Hub" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `Estado de tu prototipo: ${prototype.status}`,
    html: `
      <h1>Hola,</h1>
      <p>El estado de tu prototipo <strong>${prototype.title}</strong> ha cambiado a: <strong>${prototype.status}</strong>.</p>
      <p>Feedback del administrador: ${prototype.feedback}</p>
      <p>Si tienes dudas, contáctanos.</p>
      <p>El equipo de UX Test Hub </p>
    `,
  });
};



