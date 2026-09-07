# 🚀 Node.js Observability & Monitoring Stack (Loki + Prometheus + Grafana)

[![Node.js](https://img.shields.io/badge/Node.js-v22-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v5-lightgrey.svg)](https://expressjs.com/)
[![Prometheus](https://img.shields.io/badge/Prometheus-Monitoring-orange.svg)](https://prometheus.io/)
[![Loki](https://img.shields.io/badge/Grafana_Loki-Logging-blue.svg)](https://grafana.com/oss/loki/)
[![Grafana](https://img.shields.io/badge/Grafana-Visualization-red.svg)](https://grafana.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg)](https://www.docker.com/)

A full-stack Node.js Express application integrated with **Prometheus** for metrics collection, **Grafana Loki** for centralized logging, and **Grafana** for real-time dashboards and visualization.

---

## 📌 Features

- **Express.js Server**: High-performance Web server exposing metrics & application endpoints.
- **Prometheus Metrics**: Collects HTTP request duration histograms, response times, status codes, and default Node.js runtime metrics via `prom-client` & `response-time`.
- **Loki Centralized Logging**: Transport application log messages (info/errors) directly to Loki via `winston` and `winston-loki`.
- **Grafana Dashboard**: Unified dashboard for visualization of real-time metrics and live logs.
- **Simulated Workload & Error Rate**: Built-in heavy task simulator with randomized latency and error generation (`/slow` route) for dashboard testing.
- **Containerized Stack**: Complete Docker Compose setup to spin up Express app, Prometheus, Loki, and Grafana with a single command.

---

## 🏗️ System Architecture

```
                       +-----------------------------------+
                       |        User / HTTP Request        |
                       +-----------------+-----------------+
                                         |
                                         v
                       +-----------------+-----------------+
                       |       Node.js Express App         |
                       |          (Port: 8000)             |
                       +--------+-----------------+--------+
                                |                 |
         Logs via Winston Loki  |                 | Metrics endpoint (/metrics)
         Transport              v                 v
                 +--------------+--+           +--+--------------+
                 |  Grafana Loki   |           |    Prometheus   |
                 |  (Port: 3100)   |           |   (Port: 9090)  |
                 +--------+--------+           +--------+--------+
                          |                             |
                          +--------------+--------------+
                                         |
                                         v
                       +-----------------+-----------------+
                       |             Grafana               |
                       |          (Port: 3000)             |
                       +-----------------------------------+
```

---

## 📂 Project Structure

```
Loki_Prometheus_Grafana/
├── Dockerfile                   # Node.js Container definition
├── index.js                     # Express Server with Prometheus & Loki integration
├── util.js                      # Helper utility for workload & error simulation
├── package.json                 # Node.js dependencies & scripts
├── .gitignore                   # Ignore node_modules, logs, and sensitive data
├── README.md                    # Project documentation
└── monitoring/
    ├── docker-compose.yml       # Orchestrates Prometheus, Loki, Express App & Grafana
    ├── prometheus-config.yml    # Prometheus scrape target configuration
    └── promtail-config.yml      # Promtail configuration for system log scraping
```

---

## ⚙️ Quick Start Guide

### Prerequisites

- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) installed.
- [Node.js](https://nodejs.org/) (v18+) (optional, for local development).

---

### Option 1: Running with Docker Compose (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rahulprakash0898/Loki_Prometheus_Grafana.git
   cd Loki_Prometheus_Grafana
   ```

2. **Start the monitoring stack:**
   ```bash
   cd monitoring
   docker-compose up --build -d
   ```

3. **Access Services:**
   - 🌐 **Express App**: `http://localhost:8080`
   - 📊 **Prometheus**: `http://localhost:9090`
   - 📈 **Grafana**: `http://localhost:3000` (Default Credentials: `admin` / `admin`)
   - 🪵 **Loki**: `http://localhost:3100`

---

### Option 2: Running Locally (Node.js)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start Express app:**
   ```bash
   npm start
   ```
   The app will run at `http://localhost:8000`.

---

## 🌐 Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Standard health/welcome endpoint (Logs incoming request) |
| `GET` | `/slow` | Simulates heavy async processing & random errors (useful for latency metrics & error logs) |
| `GET` | `/metrics` | Prometheus metrics scrape endpoint |

---

## 📊 Configuring Grafana Dashboards

1. Open Grafana at `http://localhost:3000` and log in with username `admin` and password `admin`.
2. **Add Prometheus Data Source:**
   - Go to **Connections > Data Sources > Add Data Source**.
   - Select **Prometheus**.
   - Set URL to `http://prom-server:9090` (inside Docker network) or `http://localhost:9090` (local).
   - Click **Save & Test**.
3. **Add Loki Data Source:**
   - Select **Loki**.
   - Set URL to `http://loki:3100` (inside Docker network) or `http://localhost:3100` (local).
   - Click **Save & Test**.
4. **Create Dashboards:**
   - Query metrics using PromQL: `http_express_req_res_time_bucket`, `total_req`.
   - Explore logs using LogQL in **Explore** tab using Loki datasource.

---

## 🔒 Security & Privacy Audit

- **No Hardcoded Credentials**: Verified clean of private keys, AWS/VPS tokens, or secrets.
- **Sanitization**: Removed all internal IP addresses and proprietary company references.

---

## 📝 License

This project is open-source and available under the [ISC License](LICENSE).
