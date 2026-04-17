---
title: NoFlare
description: Real-time network monitoring and threat detection system
---

# NoFlare

Real-time network monitoring and threat detection system for identifying and blocking malicious traffic.

## Overview

NoFlare is a lightweight network monitoring solution that analyzes traffic patterns in real-time to detect and block DDoS attacks, intrusions, and other malicious activities.

## Features

- **Real-Time Detection** - Instant identification of threats
- **DDoS Mitigation** - Automatic rate limiting and blocking
- **Traffic Analysis** - Deep packet inspection
- **IP Reputation** - Integration with threat intelligence feeds
- **Bot Detection** - Identify and block automated traffic
- **Rate Limiting** - Configurable rate limits per endpoint
- **Geo-Blocking** - Block traffic by country/region
- **Dashboard** - Real-time metrics and alerting
- **API** - Programmatic control and integration

## Tech Stack

Go, eBPF, Redis, PostgreSQL, React

## How It Works

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Incoming  │────▶│     NoFlare      │────▶│   Protected     │
│   Traffic   │     │   (Detection)    │     │   Server       │
└─────────────┘     └──────────────────┘     └─────────────────┘
                            │
                            ▼
                    ┌──────────────────┐
                    │   Block List     │
                    │   (Auto-update)  │
                    └──────────────────┘
```

## Installation

```bash
# Using Docker
docker run -d \
  --name noflare \
  -p 8080:8080 \
  -p 8443:8443 \
  -v noflare-data:/data \
  h2hsecure/noflare

# Or build from source
git clone https://github.com/h2hsecure/noflare
cd noflare
go build -o noflare ./cmd/noflare
./noflare -config config.yaml
```

## Configuration

```yaml
server:
  http_port: 8080
  https_port: 8443
  upstream: "http://localhost:3000"

detection:
  enabled: true
  sensitivity: high
  window_seconds: 60
  thresholds:
    requests_per_minute: 1000
    concurrent_connections: 500
    error_rate: 0.1

blocking:
  mode: aggressive
  block_duration: 3600
  whitelist_ips:
    - "10.0.0.0/8"
    - "172.16.0.0/12"

geo:
  enabled: true
  blocked_countries:
    - "XX"
```

## Dashboard

Access the web dashboard at `http://localhost:8080`:

- Live traffic visualization
- Attack timeline
- Blocked IPs
- Top offenders
- System health

## API

```bash
# Get statistics
curl http://localhost:8080/api/stats

# Manually block IP
curl -X POST http://localhost:8080/api/block \
  -d '{"ip": "1.2.3.4", "reason": "manual", "duration": 3600}'

# Get block list
curl http://localhost:8080/api/blocks
```

## Use Cases

- Protect websites from DDoS attacks
- Block brute force attempts
- Rate limit API endpoints
- Detect bot traffic
- Geographic access control
- Infrastructure hardening

## Repository

[github.com/h2hsecure/noflare](https://github.com/h2hsecure/noflare)
