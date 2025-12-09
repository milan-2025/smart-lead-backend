const express = require("express");
const leadController = require("../controllers/lead.controller");

const router = express.Router();

router.post("/verify-add-users", leadController.processBatchNames);
router.get("/all-leads", leadController.getallLeads);

module.exports = router;
