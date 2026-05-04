# Build frontend
FROM node:18 as frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

# Backend
FROM node:18

WORKDIR /app

# Install backend deps
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy backend
COPY backend ./backend

# Copy built frontend into backend (serve static)
COPY --from=frontend-build /app/frontend/dist ./backend/public

WORKDIR /app/backend

EXPOSE 5000

CMD ["npm", "start"]