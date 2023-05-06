const express = require("express");

const requireAuth = require("../middleware/requireAuth");

const {
  createmysubreddiiit,
  newvisit,
  getmysubreddiits,
  deletemysubreddiit,
  getmodsubreddiitJoinedusers,
  getmodsubreddiitBlockedusers,
  getmodsubreddiitPendingusers,
  ismoderator,
  acceptuser,
  rejectuser,
  addpendinguser,
  getallsubreddiits,
  getsubreddiitsbytags,
  getsubreddiitinfo,
  leaveSubgreddiit,
  getsubgreddiitgrowth,
  getsubgreddiitpostgrowth,
  getsubgreddiitvisitors,
  getreportedpostsno
} = require("../controllers/subgreddiitsController");

const router = express.Router();

router.use(requireAuth);

router.post("/create",createmysubreddiiit);

router.post("/newvisit/:name",newvisit);

router.get("/get",getmysubreddiits);

router.delete("/delete/:id",deletemysubreddiit);

router.get("/getmodsubreddiitjoinedusers/:name",getmodsubreddiitJoinedusers);

router.get("/getmodsubreddiitblockedusers/:name",getmodsubreddiitBlockedusers);

router.get("/getmodsubreddiitpendingusers/:name",getmodsubreddiitPendingusers);

router.get("/ismoderator/:name",ismoderator);

router.post("/acceptuser/:name",acceptuser);

router.post("/rejectuser/:name",rejectuser);

router.post("/addpendinguser/:name",addpendinguser);

router.get("/getallsubreddiits",getallsubreddiits);

router.post("/getsubreddiitsbytags",getsubreddiitsbytags);

router.get("/getsubreddiitdetails/:name",getsubreddiitinfo);

router.patch("/leaveSubgreddiit/:name",leaveSubgreddiit);

router.get("/getsubgreddiitgrowth/:name",getsubgreddiitgrowth);

router.get("/getsubgreddiitpostgrowth/:name",getsubgreddiitpostgrowth);

router.get("/getsubgreddiitvisitors/:name",getsubgreddiitvisitors);

router.get("/getreportedpostsno/:name",getreportedpostsno);

module.exports = router;