import express from "express";
import dotenv from "dotenv";
import stripe from "stripe";

// load variables
dotenv.config();

// start server
const app = express();

app.use(express.static("bublic"));
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "bublic" });
});
// Woman Route
app.get("/", (req, res) => {
  res.sendFile("woman.html", { root: "bublic" });
});
// kids Route
app.get("/", (req, res) => {
  res.sendFile("kids.html", { root: "bublic" });
});
// contact Route
app.get("/", (req, res) => {
  res.sendFile("contact.html", { root: "bublic" });
});
// accessories Route
app.get("/", (req, res) => {
  res.sendFile("accessories.html", { root: "bublic" });
});
//Cart Route
app.get("/cart.html", (req, res) => {
  res.sendFile("cart.html", { root: "bublic" });
});
// Success Route
app.get("/success.html", (req, res) => {
  res.sendFile("success.html", { root: "bublic" });
});
//Cancel Route
app.get("/cancel.html", (req, res) => {
  res.sendFile("cancel.html", { root: "bublic" });
});
//login Route
app.get("/", (req, res) => {
  res.sendFile("login.html", { root: "bublic" });
});
//about Route
app.get("/", (req, res) => {
  res.sendFile("about.html", { root: "bublic" });
});
// Stripe
let stripeGatway = stripe(process.env.stripe_key);
app.post("/stripe-checkout", async (req, res) => {
  const lineItems = req.body.items.map((item) => {
    const unitAmount = parseInt(parseFloat(item.price) * 100);
    console.log("item-price:", item.price);
    console.log("unitAmount:", unitAmount);
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          images: [item.image],
        },
        unit_amount: unitAmount,
      },
      quantity: item.quantity,
    };
  });
  const session = await stripeGatway.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `http://localhost:3000/success.html`,
    cancel_url: `http://localhost:3000/cancel.html`,
    billing_address_collection: "required",
    line_items: lineItems,
  });
  res.json({ url: session.url });
});
app.listen(3000, () => {
  console.log("listing on port 3000");
});
