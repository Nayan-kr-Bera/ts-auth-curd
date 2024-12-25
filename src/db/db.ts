import mongoose from "mongoose";
import { config } from "../config/config";


const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database connected...");
    });

    mongoose.connection.on("error", (err) => {
      console.log("Error connecting to database", err);
    });

    await mongoose.connect(config.database as string);
  } catch (err) {
    console.error("failed to connect to database", err);

    process.exit(1);
  }
};

export default connectDB;