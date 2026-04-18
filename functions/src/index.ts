// import * as functions from "firebase-functions";
// import * as admin from "firebase-admin";
// import nodemailer from "nodemailer";

// admin.initializeApp();

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "anfahmy92@gmail.com",
//     pass: "psrj xkdw ttjk wfwq",
//   },
// });

// export const sendBookingEmail = functions.firestore
//   .document("bookings/{bookingId}")
//   .onCreate(async (snap) => {
//     const data = snap.data();

//     if (!data?.userEmail) return;

//     await transporter.sendMail({
//       from: "Ticketat <anfahmy92@gmail.com>",
//       to: data.userEmail,
//       subject: "🎟️ Booking Received",
//       html: `
//         <h2>Thank you for completing the down payment 🎓</h2>
//         <p>Event: ${data.eventName}</p>
//         <p>Tickets: ${data.ticketsCount}</p>
//       `,
//     });
//   });
