import { Router } from "express";
import { SoilController } from "./soil.controller";

const soilRoutes = Router();
const soilController = new SoilController();

soilRoutes.get("/soils", soilController.get.bind(soilController));

export default soilRoutes;
