const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const UploudMiddleware = require("../middleware/uploud-middleware");
const {
  uploudImageController,
  getAllImagesController,
  deleteImageController,
} = require("../controller/image-controller");

const router = express.Router();

// uplpoad image

router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  UploudMiddleware.single("image"),
  uploudImageController
);

// get image

router.get("/get", authMiddleware, getAllImagesController);

// delete image

router.delete(
  "/delete/:id",
  authMiddleware,
  adminMiddleware,
  deleteImageController
);

module.exports = router;
