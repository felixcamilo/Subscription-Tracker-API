import {createRequire} from 'module'
import Subscription from "../models/subscription.model.js";
const require = createRequire(import.meta.url);
const {serve} = require("@upstash/workflow/express")


import dayjs from 'dayjs'
import sendReminderEmail from "../utils/send-email.js";

const REMINDERS = [7, 5, 3, 1]

export const sendReminders = serve(async (context) => {

    const subscriptionId = getSubscriptionId(context);

    if (!subscriptionId) {
        console.log("Missing subscription id. Stopping workflow...");
        return;
    }

    const subscription = await fetchSubscription(context, subscriptionId);

    if (!subscription || subscription.status !== 'active') return;

    const renewalDate = dayjs(subscription.renewalDate);

    if (renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow...`);
        return;
    }

    for (const daysBefore of REMINDERS) {

        const reminderDate = renewalDate.subtract(daysBefore, 'days');

        if (reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `${daysBefore} days before reminder`, reminderDate)
        }

        if (dayjs().isSame(reminderDate, 'days') ){
            await triggerReminder(context, `${daysBefore} days before reminder`, subscription)
        }



    }



})

const getSubscriptionId = (context) => {
    if (context.requestPayload && typeof context.requestPayload === "object" && context.requestPayload.subscriptionId) {
        return context.requestPayload.subscriptionId;
    }

    try {
        const pathname = new URL(context.url).pathname;
        const match = pathname.match(/\/subscriptions\/([^/]+)\/reminder-jobs(?:\/run)?\/?$/);
        return match ? match[1] : null;
    } catch (error) {
        return null;
    }
}

const fetchSubscription = async (context, subscriptionId) => {

    return await context.run("get subscription", async ()=>{

        return Subscription.findById(subscriptionId).populate("user", "name email")
    });

}


const sleepUntilReminder = async (context, label, date) => {

    console.log(`Sleeping until ${label} reminder at ${date}`);

    await context.sleepUntil(label, date.toDate());
}


const triggerReminder = async (context, label, subscription) => {

    return await context.run(label, async ()=>{

        console.log(`Triggering ${label}`);

     // Send emails, SMS, push notifications, whatever you want

        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription
        })

        console.log(`Email sent successfully.`)
    })

}
