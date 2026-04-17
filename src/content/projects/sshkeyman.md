---
title: SSH Key Management
description: SSH key management between multiple servers and users
---

# SSH Key Management

Secure SSH key management system for managing access across multiple servers and users.

## Overview

`sshkeyman` simplifies SSH key management by providing a centralized system for distributing, rotating, and revoking SSH keys across your infrastructure.

## Features

- **Centralized Key Storage** - All SSH keys in one secure location
- **User Management** - Add/remove users, manage their keys
- **Server Inventory** - Track all servers and their authorized keys
- **Key Rotation** - Automatic rotation of SSH keys
- **Access Groups** - Organize servers and users into groups
- **Audit Trail** - Track who accessed what and when
- **Ansible Integration** - Push keys to servers automatically
- **Command-Line Interface** - Full CLI for scripting

## Installation

```bash
# Install from source
go install github.com/h2hsecure/sshkeyman/cmd/sshkeyman@latest

# Or use the binary release
curl -fsSL https://raw.githubusercontent.com/h2hsecure/sshkeyman/main/install.sh | bash
```

## Usage

```bash
# Initialize sshkeyman
sshkeyman init

# Add a user
sshkeyman user add alice --email alice@example.com

# Add a server
sshkeyman server add web-1 --host 10.0.1.10 --user deploy

# Grant access
sshkeyman access grant alice web-1

# Sync keys to servers
sshkeyman sync

# Rotate keys
sshkeyman rotate --server web-1
```

## Configuration

```yaml
# sshkeyman.yaml
storage:
  type: postgres
  host: localhost
  port: 5432
  database: sshkeyman

ssh:
  key_type: ed25519
  key_bits: 4096
  rotation_days: 90

notifications:
  email: true
  slack_webhook: ""
```

## How It Works

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  sshkeyman  │────▶│  PostgreSQL DB   │     │   Target        │
│   Server    │     │  (Key Storage)   │     │   Servers       │
└─────────────┘     └──────────────────┘     └─────────────────┘
       │                                              ▲
       │            ┌──────────────────┐               │
       └──────────▶│   SSH Key        │───────────────┘
                   │   Distribution   │
                   └──────────────────┘
```

## Security

- Keys are encrypted at rest using AES-256
- No plaintext private keys stored
- Secrets never logged
- Two-factor authentication for CLI
- IP allowlisting
- Session recording

## Repository

[github.com/h2hsecure/sshkeyman](https://github.com/h2hsecure/sshkeyman)
