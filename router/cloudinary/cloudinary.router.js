const { Router } = require("express");
const router = Router();

const JsonFileService = require("../../services/json/json.services");
const jsonFileService = new JsonFileService("cloudinary");

router.get("/*", async (req, res) => {
  try {
    const { originalUrl } = req;
    const splitUrl = originalUrl.split("/");
    splitUrl.shift();

    let folder = await (await jsonFileService.readJson()).data;

    splitUrl.forEach((i) => {
      if (!folder[i]) return;
      folder = folder[i];
    });

    res.json({ success: true, data: folder });
  } catch (e) {
    console.error(e);
    res.json({
      success: false,
      error: e.message,
    });
  }
});

module.exports = router;
