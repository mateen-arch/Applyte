const express = require('express');
const { isAuthorized } = require('../middlewares/auth');
const { getAllSessions, getSessionByID, createSession, deleteSession } = require('../controllers/InterviewPrep/session_controller');
const router = express.Router();

router.get("/get-all-sessions",isAuthorized,getAllSessions);
router.get("/get-session-by-id/:id",isAuthorized,getSessionByID);
router.post("/create-session",isAuthorized,createSession);
router.delete("/delete-session/:id",isAuthorized, deleteSession);

module.exports = router;