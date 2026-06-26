const nodemailer = require('nodemailer');

const ORDER_RECIPIENT = 'jv@proddigit.shop';

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

function buildEmailBody(data) {
  const now = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });

  return `
NUEVO PEDIDO DE PLAYERA
========================
Fecha y hora: ${now}

DATOS DEL CLIENTE
-----------------
Nombre:        ${data.nombre} ${data.apellido}
Contacto:      ${data.contacto}

DETALLES DEL PEDIDO
-------------------
Talla:         ${data.talla}
Color:         ${data.color}
Modelo:        ${data.modelo}
Punto de entrega: ${data.entrega}

========================
Pedido recibido via Agente de IA (llamada telefónica)
  `.trim();
}

async function sendOrderEmail(orderData) {
  const transporter = createTransport();

  const mailOptions = {
    from: `"Agente de Pedidos" <${process.env.SMTP_USER}>`,
    to: ORDER_RECIPIENT,
    subject: `Nuevo pedido - ${orderData.nombre} ${orderData.apellido}`,
    text: buildEmailBody(orderData)
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`Email de pedido enviado: ${info.messageId}`);
  return info;
}

module.exports = { sendOrderEmail };
