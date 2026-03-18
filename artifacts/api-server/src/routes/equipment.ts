import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { equipmentTable } from "@workspace/db/schema";
import { ListEquipmentResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/equipment", async (_req, res) => {
  try {
    const equipment = await db.select().from(equipmentTable);
    const mapped = equipment.map(e => ({
      id: e.id,
      title: e.title,
      category: e.category,
      condition: e.condition,
      price: e.price,
      seller: e.seller,
      verified: e.verified,
      purchaseType: e.purchaseType as "normal" | "verified",
      imageUrl: e.imageUrl,
      size: e.size ?? undefined,
      brand: e.brand,
    }));
    const data = ListEquipmentResponse.parse(mapped);
    res.json(data);
  } catch (err) {
    console.error("Equipment route error:", String(err));
    res.status(500).json({ error: "Failed to fetch equipment" });
  }
});

export default router;
