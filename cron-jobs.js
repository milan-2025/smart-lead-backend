const cron = require("node-cron");
const Lead = require("./modal/Lead");

const syncVerifiedLeads = async () => {
  console.log("[Scheduler] Starting CRM Sync check...");

  try {
    // 1. Identify: Find all leads that are 'Verified' AND have NOT been synced yet.
    //
    const leadsToSync = await Lead.find({
      status: "Verified",
      isCRMSynced: false,
    }).exec();

    if (leadsToSync.length === 0) {
      console.log("[CRM Sync] No new verified leads found to sync.");
      return;
    }

    console.log(
      `[CRM Sync] Found ${leadsToSync.length} lead(s) ready for sync.`
    );

    // Prepare a list of updates
    const bulkUpdateOperations = leadsToSync.map((lead) => ({
      // Update a single document by its _id
      updateOne: {
        filter: { _id: lead._id },
        // 3. Idempotency: Set the flags so it won't be synced again
        update: {
          $set: {
            isCRMSynced: true,
            crmSyncDate: new Date(),
          },
        },
      },
    }));

    // Perform the bulk update to mark them as synced in the database
    if (bulkUpdateOperations.length > 0) {
      // Mongoose bulkWrite is highly efficient for multiple updates
      const updateResult = await Lead.bulkWrite(bulkUpdateOperations);
      // console.log(`[CRM Sync] Successfully marked ${updateResult.modifiedCount} lead(s) as synced in the database.`);
    }

    // 2. Sync Simulation: Log the required message for each lead
    leadsToSync.forEach((lead) => {
      console.log(
        `[CRM Sync] Sending verified lead ${lead.name} to Sales Team...`

        // can use socket.io to send info to sales team
      );
    });

    console.log("[Scheduler] CRM Sync check complete.");
  } catch (error) {
    console.error("[CRM Sync ERROR]", error);
  }
};

const startAutomation = () => {
  // The cron expression '*/5 * * * *' means "at every 5th minute"
  cron.schedule("*/5 * * * *", syncVerifiedLeads);
  console.log("Background task scheduled to run every 5 minutes.");
};

module.exports = { startAutomation };
