const config = require('../../config');
const stripe = require('stripe')(config.STRIPE_KEY_LIVE);


async function checkout(chatId,user,trackerId) {
  
  const successUrl = `https://www.pregnancyprayerguide.com/api/stripe/success?session_id={CHECKOUT_SESSION_ID}&fname=${user}&chat_id=${chatId}&track=${trackerId}`
  const failerUrl = `https://www.pregnancyprayerguide.com/api/stripe/failure?session_id={CHECKOUT_SESSION_ID}&fname=${user}&chat_id=${chatId}`
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: config.SUBSCRIPTION_PRICE_LIVE,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: failerUrl,

  });

  return session.url||null
};

module.exports = { checkout};