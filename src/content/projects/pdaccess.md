---
title: PDAccess
description: Next-generation IAM & PAM platform for modern cloud environments
---

# PDAccess

Next-generation **Identity & Access Management (IAM)** and **Privileged Access Management (PAM)** platform focused on simplicity, security, and modern cloud environments.

## Overview

PDAccess provides enterprise-grade identity management with an intuitive interface. Built for teams that need secure, scalable access control without the complexity of traditional IAM solutions.

## Features

- **Single Sign-On (SSO)** - Centralized authentication across all applications
- **Multi-Factor Authentication (MFA)** - TOTP, SMS, Hardware keys
- **Role-Based Access Control (RBAC)** - Fine-grained permissions
- **Privileged Session Management** - Recording and monitoring of privileged sessions
- **Just-In-Time Access** - Temporary elevated access on demand
- **Audit Logging** - Complete audit trail of all access events
- **API-First Design** - Full REST API for automation
- **Cloud-Native Architecture** - Runs anywhere, scales automatically

## Tech Stack

Go, PostgreSQL, Redis, React, Kubernetes

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Users     │────▶│   PDAccess   │────▶│   Applications  │
└─────────────┘     │   Portal     │     └─────────────────┘
                    │   & API      │     ┌─────────────────┐
                    └──────────────┘────▶│   Databases     │
                             │            └─────────────────┘
                             ▼
                    ┌──────────────┐
                    │   Audit Log  │
                    └──────────────┘
```

## Quick Start

```bash
# Deploy with Docker Compose
docker-compose up -d

# Or use Helm chart
helm install pdaccess ./charts/pdaccess
```

## Enterprise Features

- **SAML 2.0 / OIDC** - Integration with enterprise identity providers
- **LDAP/Active Directory Sync** - Keep users in sync
- **High Availability** - Active-active cluster support
- **Self-Hosted Option** - Full control, on-premise deployment
- **Compliance** - SOC2, HIPAA, GDPR ready

## Documentation

[Visit pdaccess.com](https://www.pdaccess.com)
