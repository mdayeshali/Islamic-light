// আপনার ভারতের কান্ট্রি কোডসহ ১০ সংখ্যার মোবাইল নম্বর দিন (যেমন: "919876543210")
const WHATSAPP_NUMBER = "91XXXXXXXXXX";

document.addEventListener("DOMContentLoaded", () => {
  const orderButtons = document.querySelectorAll(".btn-order");

  orderButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productName = button.getAttribute("data-name");
      const price = button.getAttribute("data-price");

      sendWhatsAppOrder(productName, price);
    });
  });
});

function sendWhatsAppOrder(productName, price) {
  const message = 
`আসসালামু আলাইকুম,
আমি islamiclight.in থেকে এই বইটি নিতে চাচ্ছি:

📖 বইটি: ${productName}
💰 মূল্য: ₹${price}

দয়া করে পেমেন্টের UPI ডিটেইলস এবং ডেলিভারির নিয়মটি জানাবেন।`;

  const encodedMsg = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`;

  // নতুন ট্যাবে হোয়াটসঅ্যাপ ওপেন হবে
  window.open(whatsappUrl, "_blank");
}
