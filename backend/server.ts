import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

//MIDDLEWARES
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}....`);
});
