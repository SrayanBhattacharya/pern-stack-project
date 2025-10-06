import express from "express";
const router = express.Router();
router.get("/test", (req, res) => {
    res.send("Testing....");
});
export default router;
