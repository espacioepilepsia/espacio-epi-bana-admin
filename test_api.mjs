fetch("http://localhost:3001/api/send-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    to: "hola@jorgefariello.com",
    subject: "Test desde Api",
    text: "funciona?"
  })
}).then(async r => {
  const t = await r.text();
  console.log("Status:", r.status);
  console.log("Response:", t);
}).catch(console.error);
