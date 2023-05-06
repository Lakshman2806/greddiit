const express = require("express");

const requireAuth = require("../middleware/requireAuth");

const {
    ReportPost,
    CheckReport,
    getAllReports,
    DeletePost,
    BlockUser,
    IgnoreReport,
} = require("../controllers/reportController");


const router = express.Router();

router.use(requireAuth);

router.post("/reportpost/:Post_Id",ReportPost);

router.get("/checkreport/:Post_Id",CheckReport);

router.get("/getallreports/:Subgreddiit_name",getAllReports);

router.delete("/deletepost/:Post_Id",DeletePost);

router.patch("/blockuser/:Post_Id",BlockUser);

router.patch("/ignorereport/:Report_Id",IgnoreReport);

module.exports = router;