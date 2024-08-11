// const Stripe = require('stripe')

// const database = require('../database')

const profile = async (req, res) => {
  try {
    const { user } = req;
    const updatedUser = { ...user };
    // const bypassPaywallUsernames = process.env.REACT_APP_BYPASS_PAYWALL_USERNAMES.split(',').map(n => n.trim())

    // if (user.role === 'teacher' && !bypassPaywallUsernames.includes(user.username)) {
    //   const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
    //   const { data } = await stripe.subscriptions.search({
    //     query: `metadata[\'userId\']:\'${user._id.toString()}\'`,
    //     limit: 1,
    //   })
    //   const subscription = data?.length ? data[0] : null
    //   if (subscription) {
    //     updatedUser.subscription = {
    //       isSubscribed: true,
    //       isActive: ['active', 'trialing'].includes(subscription.status),
    //       isTrial: subscription.status === 'trialing',
    //       periodStartDate: subscription.current_period_start,
    //       periodEndDate: subscription.current_period_end,
    //       customerId: subscription.customer,
    //     }
    //     if (!user.trialUsed && subscription.status === 'trialing') {
    //       const usersColl = database.users()
    //       const ObjectID = database.ObjectID()
    //       await usersColl.findOneAndUpdate(
    //         { _id: new ObjectID(user._id) },
    //         { $set: { trialUsed: true } }
    //       )
    //     }
    //   }
    // }
    if (req?.passBack) return updatedUser;
    return res.send({ user: updatedUser });
  } catch (e) {
    console.log(e);
    return res.status(400).send('Error');
  }
};

module.exports = profile;
