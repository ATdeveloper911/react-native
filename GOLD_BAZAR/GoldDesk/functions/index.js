const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const db = admin.firestore();

// Transporter configuration using provided credentials
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "taimoordev.op@gmail.com",
        pass: "hyig xorm attn ukia",
    },
});

exports.sendWelcomeEmail = functions.firestore
    .document("users/{userId}")
    .onCreate(async (d, context) => {
        const userData = d.data();
        const email = userData.email;
        const username = userData.username || "User";

        const mailOptions = {
            from: '"AG SON\'S GOLD LAB Admin" <taimoordev.op@gmail.com>',
            to: email,
            subject: "Welcome to AG SON'S GOLD LAB - Account Pending Approval",
            text: `Hello ${username},\n\nThank you for signing up to AG SON'S GOLD LAB.\n\nYour account is currently under review. Using the AG SON'S GOLD LAB app requires administrator approval.\n\nWe will notify you once your account involves been activated.\n\nBest regards,\nAG SON'S GOLD LAB Team`,
            html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h1 style="color: #DAA520;">Welcome to AG SON'S GOLD LAB!</h1>
          <p>Hello <strong>${username}</strong>,</p>
          <p>Thank you for creating an account.</p>
          <div style="background-color: #FFF8DC; border-left: 5px solid #DAA520; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold;">Status: Pending Approval</p>
            <p style="margin: 5px 0 0 0;">Your account is currently under review logic. You will not be able to log in until an administrator approves your request.</p>
          </div>
          <p>Please wait for further updates.</p>
          <br>
          <p>Best regards,</p>
          <p>The AG SON'S GOLD LAB Team</p>
        </div>
      `,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Welcome email sent to ${email}`);
        } catch (error) {
            console.error("Error sending welcome email:", error);
        }
    });

exports.deleteAuthUser = functions.firestore
    .document("users/{userId}")
    .onDelete(async (snap, context) => {
        const userId = context.params.userId;
        try {
            await admin.auth().deleteUser(userId);
            console.log(`Successfully deleted user ${userId} from Auth.`);
        } catch (error) {
            console.error(`Error deleting user ${userId} from Auth:`, error);
        }
    });

/**
 * Scheduled Function: Fetch Gold/Silver prices from Twelve Data API every 5 minutes
 * 
 * This function:
 * 1. Fetches data from Twelve Data API (XAU/USD for gold, XAG/USD for silver)
 * 2. Extracts Bid/Ask prices in USD per ounce directly from API
 * 3. Saves to Firestore collection: market_data/live_rates
 * 
 * Requirements:
 * - Must be on Blaze Plan (Pay-as-you-go) - but free tier usage is $0
 * - API Key: d05154b2ca32437db887c4068d853796
 */
exports.fetchMarketRates = functions
    .runWith({
        // Increase timeout to 60 seconds (default is 60s, but being explicit)
        timeoutSeconds: 60,
        // Memory allocation (256MB is default, but being explicit)
        memory: "256MB",
    })
    .pubsub
    .schedule("every 5 minutes") // Runs every 5 minutes
    .timeZone("UTC")
    .onRun(async (context) => {
        console.log("[MarketRates] Scheduled function triggered at:", new Date().toISOString());

        try {
            // Twelve Data API Key
            const apiKey = process.env.TWELVE_DATA_API_KEY || "d05154b2ca32437db887c4068d853796";

            if (!apiKey) {
                throw new Error("TWELVE_DATA_API_KEY is not configured.");
            }

            // Fetch from Twelve Data API - Gold (XAU/USD) and Silver (XAG/USD)
            // Twelve Data returns bid and ask prices directly in USD per ounce
            const goldUrl = `https://api.twelvedata.com/price?symbol=XAU/USD&apikey=${apiKey}`;
            const silverUrl = `https://api.twelvedata.com/price?symbol=XAG/USD&apikey=${apiKey}`;
            
            console.log("[MarketRates] Fetching from Twelve Data API...");

            // Fetch both gold and silver prices in parallel
            const [goldResponse, silverResponse] = await Promise.all([
                fetch(goldUrl),
                fetch(silverUrl)
            ]);

            if (!goldResponse.ok) {
                const errorText = await goldResponse.text();
                throw new Error(`Twelve Data API error (Gold): ${goldResponse.status} - ${errorText}`);
            }

            if (!silverResponse.ok) {
                const errorText = await silverResponse.text();
                throw new Error(`Twelve Data API error (Silver): ${silverResponse.status} - ${errorText}`);
            }

            const goldData = await goldResponse.json();
            const silverData = await silverResponse.json();

            // Check for API errors in response
            if (goldData.status === "error") {
                throw new Error(`Twelve Data API error (Gold): ${goldData.message || "Unknown error"}`);
            }

            if (silverData.status === "error") {
                throw new Error(`Twelve Data API error (Silver): ${silverData.message || "Unknown error"}`);
            }

            // Extract prices from Twelve Data API response
            // Twelve Data returns: { price, bid, ask } in USD per ounce
            const goldPrice = parseFloat(goldData.price) || 0;
            const goldBid = parseFloat(goldData.bid) || goldPrice; // Use bid if available, fallback to price
            const goldAsk = parseFloat(goldData.ask) || goldPrice; // Use ask if available, fallback to price

            const silverPrice = parseFloat(silverData.price) || 0;
            const silverBid = parseFloat(silverData.bid) || silverPrice; // Use bid if available, fallback to price
            const silverAsk = parseFloat(silverData.ask) || silverPrice; // Use ask if available, fallback to price

            if (goldPrice === 0 || silverPrice === 0) {
                throw new Error("Invalid price data from Twelve Data API");
            }

            // Prepare data for Firestore
            // All prices are in USD per ounce (bid and ask from API)
            const marketData = {
                goldPrice: goldPrice, // USD per ounce
                goldBid: goldBid,    // USD per ounce (bid)
                goldAsk: goldAsk,     // USD per ounce (ask)
                silverPrice: silverPrice, // USD per ounce
                silverBid: silverBid,     // USD per ounce (bid)
                silverAsk: silverAsk,    // USD per ounce (ask)
                lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
                // Store source info
                source: "twelve_data",
                timestamp: new Date().toISOString(),
            };

            // Save to Firestore: market_data/live_rates
            await db.collection("market_data").doc("live_rates").set(marketData, { merge: true });

            console.log("[MarketRates] Successfully updated market rates from Twelve Data:", {
                goldPrice: goldPrice.toFixed(2),
                goldBid: goldBid.toFixed(2),
                goldAsk: goldAsk.toFixed(2),
                silverPrice: silverPrice.toFixed(2),
                silverBid: silverBid.toFixed(2),
                silverAsk: silverAsk.toFixed(2),
                timestamp: new Date().toISOString(),
            });

            return null; // Scheduled functions should return null or a value
        } catch (error) {
            console.error("[MarketRates] Error fetching market rates:", error);
            // Don't throw - we don't want to fail the scheduled function
            // Instead, log the error for monitoring
            return null;
        }
    });
