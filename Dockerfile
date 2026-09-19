# syntax=docker/dockerfile:1

# --- Build stage: compile la SPA Vite ---------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Bakées dans le bundle JS au moment du build (Vite), pas lues au runtime du
# conteneur — valeurs passées en --build-arg par .gitlab-ci.yml (variables
# GitLab CI), pas via le .env du serveur comme Backend/Messagerie.
ARG VITE_API_URL
ARG VITE_MESSAGING_API_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_MESSAGING_API_URL=$VITE_MESSAGING_API_URL
RUN npm run build

# --- Runtime stage: nginx statique, rien du toolchain Node ------------------
FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
