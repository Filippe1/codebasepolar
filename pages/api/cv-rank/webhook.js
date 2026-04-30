// former stripe webhook
// File: /pages/api/webhooks/polar.js
// Next.js Pages Router (JavaScript)

export const config = {
    api: {
      bodyParser: false,
    },
  };
  
  function getRawBody(req) {
    return new Promise((resolve, reject) => {
      const chunks = [];
  
      req.on("data", (chunk) => chunks.push(chunk));
      req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      req.on("error", reject);
    });
  }
  
  export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    try {
      const rawBody = await getRawBody(req);
  
      // 🔥 LOG FIRST (critical for debugging)
      console.log("RAW WEBHOOK:", rawBody);
  
      let event;
      try {
        event = JSON.parse(rawBody);
      } catch (e) {
        console.error("JSON parse error:", e);
        return res.status(400).json({ error: "Invalid JSON" });
      }
  
      // ✅ YOUR CONFIRMATION LOGIC
      if (event?.type === "subscription.active") {
        console.log("✅ Polar subscription active webhook received");
        console.log("User:", event?.data?.customer?.email);
  
        return res.status(200).json({
          received: true,
          type: event.type,
        });
      }
  
      return res.status(200).json({
        received: true,
        ignored: true,
        type: event?.type,
      });
    } catch (err) {
      console.error("Webhook error:", err);
      return res.status(500).json({ error: "Internal error" });
    }
  }