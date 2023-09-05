import Express from "express";
import * as controllers from "../controllers";

const router = Express.Router();

router.get("/*", Express.static("src/pages"));
router.get("/api/stress/:id", controllers.selectStress);
router.post("/api/stress", controllers.createStress);

export default router;