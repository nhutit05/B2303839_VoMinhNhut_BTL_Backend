import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/dbConfig.js";
import { initNhacNhoJob } from "./cron/nhacNhoJob.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
	try {
		await connectDB();
		console.log(`✅ Database connected!`);

		initNhacNhoJob();
		console.log(`⏰ Cron Job initialized!`);

		app.listen(PORT, () => {
			console.log(`🚀 Server is running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Failed to start server:", error);
		process.exit(1);
	}
};

startServer();
