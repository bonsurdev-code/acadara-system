import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import morgan from "morgan"
dotenv.config()
import { sequelize } from './models/index.js';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import matchRoutes from './routes/match.route.js';
import sessionRoutes from './routes/session.route.js';
import ratingRoutes from './routes/rating.route.js';
import messageRoutes from './routes/message.route.js';
import adminRoutes from './routes/admin.routes.js';
import publicRoutes from './routes/public.routes.js';

const app = express()
const PORT = process.env.PORT || 5000

// app.use(cors({
//     origin: 'https://acadara.netlify.app',
//     credentials: true
// }))
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(morgan("dev"))

app.use((req, res, next) => {
  res.setHeader(
    "Cross-Origin-Opener-Policy",
    "same-origin-allow-popups"
  );
  next();
});

app.get("/", (req, res) => {
    res.status(200).json({ message: "API is working . . ." })
})

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/match", matchRoutes)
app.use("/api/session", sessionRoutes)
app.use("/api/ratings", ratingRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/admin", adminRoutes)

app.use("/api/public", publicRoutes)

sequelize.sync().then(() => app.listen(PORT))