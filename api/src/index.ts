import express from "express";
import { router as routes } from "./routes";
import { soilService } from "./modules/soils/services/soil.service";

const app = express();
app.use(express.json());

let warmedUp = false;
app.use(async (_req, _res, next) => {
  if (!warmedUp) {
    try {
      await soilService.warmUp();
      warmedUp = true;
    } catch (error) {
      console.error("[warmup] falha ao pré-carregar dados:", error);
    }
  }
  next();
});

app.use(routes);

export default app;

if (require.main === module) {
  const { API_PORT } = require("./settings");
  app.listen(API_PORT, () => console.log(`Server running on ${API_PORT}`));
}
