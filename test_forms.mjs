const endpoint = "http://localhost:3000/api/send-email";

const formsToTest = [
  {
    subject: "Formulario Web Newsletter",
    text: "Nuevo registro en Newsletter:\nEmail: test@example.com"
  },
  {
    subject: "Formulario Web Contacto",
    text: "Nuevo mensaje de Contacto:\nNombre: Juan Perez\nEmail: test@example.com\nTel: +54111222333\nMensaje: Hola, esto es una prueba."
  },
  {
    subject: "Formulario Web Sumate",
    text: "Nueva postulación en Sumate:\nNombre: Ana Lopez\nEmail: test@example.com\nCiudad/País: Buenos Aires\nExp: Diseño\nMensaje: Quiero ayudar."
  },
  {
    subject: "Formulario Web Descargable",
    text: "Nueva descarga de recurso de Primeros Auxilios:\nNombre: Carlos Test\nEmail: test@example.com"
  },
  {
    subject: "Formulario Web Tu Historia",
    text: "Nueva historia enviada:\nNombre: Pedro\nEmail: test@example.com\nEdad: 30\nHistoria: Esta es mi historia de prueba."
  }
];

async function runTests() {
  for (const form of formsToTest) {
    console.log(`Enviando test: ${form.subject}`);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "espacioepilepsia.arg@gmail.com",
          subject: form.subject + " (Prueba del Sistema)",
          text: form.text
        })
      });
      const data = await res.json();
      console.log(`Resultado ${form.subject}:`, Object.keys(data).includes("error") ? "Error" : "OK", data);
    } catch (e) {
      console.error(`Error de red en ${form.subject}:`, e.message);
    }
  }
}

runTests();
