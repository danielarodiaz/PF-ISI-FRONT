FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL=http://localhost:5132
ARG VITE_CHATBOT_URL=http://localhost:8080
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_CHATBOT_URL=${VITE_CHATBOT_URL}

RUN npm run build

FROM nginx:1.27-alpine AS runtime
WORKDIR /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist ./

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=3s --retries=5 CMD curl -fsS http://127.0.0.1/health > /dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
