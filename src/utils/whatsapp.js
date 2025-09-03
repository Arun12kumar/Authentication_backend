import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendOrderToWhatsApp = async (order) => {
  try {
    const messageBody = `
🛒 *New Order Received!*

👤 Customer: ${order.customer.name}
📞 Phone: ${order.customer.phone}
🏠 Address: ${order.customer.address}, ${order.customer.city}, ${order.customer.postalCode}, ${order.customer.country}

📦 *Items:*
${order.items.map(i => `- ${i.productName} (${i.variantName}) x${i.quantity} = ₹${i.price * i.quantity}`).join("\n")}

🧾 Total Quantity: ${order.totalQuantity}
💰 Total Amount: ₹${order.totalAmount}

✅ Please prepare the order!
    `;

    const msg = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: process.env.SELLER_WHATSAPP_NUMBER,
      body: messageBody,
    });

    console.log("WhatsApp message sent:", msg.sid);
  } catch (error) {
    console.error("Error sending WhatsApp:", error);
  }
};
