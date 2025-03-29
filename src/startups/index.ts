import { Application } from "express";
import dotenv from "dotenv";
import routesStartup from "./routes.startup";
dotenv.config();
const PORT = process.env.PORT || 8081;

export default (app: Application) => {
  routesStartup(app);
  app.listen(PORT, () => {
    console.log(`App Listing to port ${PORT}`);
  });
};
