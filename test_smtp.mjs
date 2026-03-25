import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function testStr() {
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: "contacto@espacioepilepsia.org.ar",
      pass: process.env.SMTP_PASSWORD,
    },
    debug: true, // show debug output
    logger: true, // log to console
  });

  try {
    await transporter.verify();
    console.log("SUCCESS: SMTP connection verified with port 465 (SSL)");
  } catch (error) {
    console.error("ERROR testing port 465:", error);

    // Try port 587 with STARTTLS
    console.log("\nTrying port 587 (STARTTLS)...");
    const transporter587 = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "contacto@espacioepilepsia.org.ar",
        pass: process.env.SMTP_PASSWORD,
      },
      debug: true,
      logger: true,
    });

    try {
      await transporter587.verify();
      console.log("SUCCESS: SMTP connection verified with port 587 (STARTTLS)");
    } catch (e2) {
      console.error("ERROR testing port 587:", e2);
    }
  }
}

testStr();
