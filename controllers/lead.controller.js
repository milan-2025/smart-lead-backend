const axios = require("axios");
const Lead = require("../modal/Lead");

const API_BASE_URL = "https://api.nationalize.io";

// normalize api to check name
const getDataFromNormalizeApi = async (name) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/?name=${name}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for ${name}:`, error.message);
    return { name, error: error.message };
  }
};
const leadController = {
  processBatchNames: async (req, res) => {
    const { names } = req.body;

    if (!Array.isArray(names) || names.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or empty list of names provided." });
    }

    const fetchPromises = names.map((name) => getDataFromNormalizeApi(name));

    const results = await Promise.allSettled(fetchPromises);

    const successfulResults = [];
    const failedResults = [];

    // --- 2. Process Results and Prepare for DB Save ---
    const dataToSave = results
      .filter((result, index) => {
        if (result.status === "fulfilled" && !result.value.error) {
          successfulResults.push(result.value);
          return true;
        } else {
          const name = names[index];
          failedResults.push({
            name,
            reason:
              result.reason?.message ||
              result.value?.error ||
              "API call failed",
          });
          return false;
        }
      })
      .map((result) => {
        if (Number(result.value.country[0].probability.toFixed(5)) >= 0.6) {
          return {
            name: result.value.name,
            country: result.value.country[0].country_id,
            probability: Number(result.value.country[0].probability.toFixed(5)),
            status: "Verified",
          };
        } else {
          return {
            name: result.value.name,
            country: result.value.country[0].country_id,
            probability: Number(result.value.country[0].probability.toFixed(5)),
            status: "To Check",
          };
        }
      }); // Extract the value from fulfilled promises

    // --- 3. Save to MongoDB
    try {
      console.log("data to save---", dataToSave);

      for (let i = 0; i < dataToSave.length; i++) {
        await Lead.updateOne({ name: dataToSave[i].name }, dataToSave[i], {
          upsert: true,
        });
      }

      return res.status(200).json({
        message: "Batch processing complete.",
        successCount: successfulResults.length,
        failCount: failedResults.length,
        successfulData: successfulResults,
        failedRequests: failedResults,
      });
    } catch (dbError) {
      // This often catches duplicate key errors (unique: true on name), which is fine.
      console.error("Database insertion error:", dbError.message);
      return res.status(500).json({
        message:
          "Batch processing finished, but some data failed to save/update to the database.",
        dbErrorMessage: dbError.message,
        successfulData: successfulResults,
        failedRequests: failedResults,
      });
    }
  },

  getallLeads: async (req, res) => {
    try {
      let { page = 1, limit = 5, filterValue } = req.query;
      page = parseInt(page, 10);
      limit = parseInt(limit, 10);
      let total = null;
      let noOfPages = null;
      let skip = (page - 1) * limit;
      let leads = null;
      if (filterValue) {
        total = await Lead.countDocuments({ status: filterValue });
        noOfPages = Math.ceil(total / limit);
        leads = await Lead.find({ status: filterValue })
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit);
      } else {
        total = await Lead.countDocuments();
        noOfPages = Math.ceil(total / limit);
        leads = await Lead.find({})
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit);
      }

      return res.status(200).json({
        leads: leads,
        page,
        limit,
        noOfPages,
        total,
      });
    } catch (error) {
      console.log("error while getting leads", error);
      return res.status(500).json({
        error: error.message || "Error while getting all leads",
      });
    }
  },
};

module.exports = leadController;
