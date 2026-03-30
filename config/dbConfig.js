import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		// console.log("Database is connected");
	} catch (err) {
		console.error("Error connecting to the database:", err);
		process.exit(1);
	}
};
