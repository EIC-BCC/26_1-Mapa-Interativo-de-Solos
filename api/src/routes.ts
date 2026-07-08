import { Router } from "express";

import soilRoutes from "./modules/soils/soil.router";

const router = Router();

router.use(soilRoutes);

export { router }
