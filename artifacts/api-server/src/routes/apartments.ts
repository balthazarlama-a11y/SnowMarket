import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { apartmentsTable } from "@workspace/db/schema";
import { ListApartmentsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/apartments", async (_req, res) => {
  try {
    const apartments = await db.select().from(apartmentsTable);
    const data = ListApartmentsResponse.parse(apartments.map(a => ({
      ...a,
      amenities: a.amenities ?? [],
    })));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch apartments" });
  }
});

export default router;
