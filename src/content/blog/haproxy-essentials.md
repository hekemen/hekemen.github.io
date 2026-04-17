---
title: HAProxy Essentials
description: A comprehensive guide to setting up and configuring HAProxy for load balancing
---

# HAProxy Essentials

HAProxy (High Availability Proxy) is a free, open-source software that provides a high-performance load balancer and proxy server for TCP and HTTP-based applications.

## Why HAProxy?

HAProxy is trusted by many high-traffic websites and is known for:

- **High performance** - Handles thousands of connections with low CPU usage
- **Reliability** - Battle-tested in production environments
- **Flexibility** - Supports multiple load balancing algorithms
- **Health checks** - Automatic detection of unhealthy backends
- **SSL termination** - Built-in HTTPS support
- **Statistics** - Real-time monitoring dashboard

## Installation

### Ubuntu/Debian

```bash
sudo apt update
sudo apt install haproxy
```

### macOS

```bash
brew install haproxy
```

### Verify Installation

```bash
haproxy -v
```

## Basic Configuration

HAProxy configuration is defined in `/etc/haproxy/haproxy.cfg`. Here's a simple HTTP load balancer setup:

```haproxy
global
    log /dev/log local0
    log /dev/log local1 notice
    chroot /var/lib/haproxy
    stats socket /run/haproxy/admin.sock mode 660 level admin
    stats timeout 30s
    user haproxy
    group haproxy
    daemon

defaults
    log     global
    mode    http
    option  httplog
    option  dontlognull
    timeout connect 5000ms
    timeout client  50000ms
    timeout server  50000ms

frontend http_front
    bind *:80
    mode http
    
    default_backend web_servers

backend web_servers
    mode http
    balance roundrobin
    option httpchk GET /health
    server web1 192.168.1.101:8080 check inter 2000 rise 2 fall 3
    server web2 192.168.1.102:8080 check inter 2000 rise 2 fall 3
    server web3 192.168.1.103:8080 check inter 2000 rise 2 fall 3
```

## Load Balancing Algorithms

HAProxy supports several algorithms:

### Round Robin (default)

```haproxy
balance roundrobin
```

Requests are distributed sequentially to each server.

### Least Connections

```haproxy
balance leastconn
```

Routes to the server with the fewest active connections.

### Source/IP Hash

```haproxy
balance source
```

Routes based on a hash of the client's IP, ensuring session persistence.

### URI Hash

```haproxy
balance uri
```

Routes based on a hash of the URI, useful for caching.

## Health Checks

Health checks determine if a backend server is operational:

```haproxy
backend web_servers
    option httpchk GET /health
    http-check expect status 200
    server web1 192.168.1.101:8080 check inter 3s fall 3 rise 2
```

Parameters:
- `inter 3s` - Check every 3 seconds
- `fall 3` - Mark down after 3 failed checks
- `rise 2` - Mark up after 2 successful checks

## SSL/TLS Termination

Secure your traffic with HTTPS:

```haproxy
frontend https_front
    bind *:443 ssl crt /etc/ssl/certs/myapp.pem
    
    default_backend web_servers

backend web_servers
    mode http
    balance roundrobin
    server web1 192.168.1.101:8080 check
```

Generate a self-signed certificate for testing:

```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
cat key.pem cert.pem > myapp.pem
```

## Statistics Dashboard

Enable the HAProxy stats page for monitoring:

```haproxy
listen stats
    bind *:8404
    stats enable
    stats uri /stats
    stats refresh 30s
    stats admin if LOCALHOST
```

Access at `http://your-server:8404/stats`

## ACLs for Advanced Routing

Route traffic based on conditions:

```haproxy
frontend http_front
    bind *:80
    
    acl is_api path_beg /api
    acl is_admin hdr_sub(host) -i admin
    
    use_backend api_servers if is_api
    use_backend admin_servers if is_admin
    default_backend web_servers
```

## High Availability

Combine with Keepalived for failover:

```bash
# /etc/keepalived/keepalived.conf on primary server
vrrp_script chk_haproxy {
    script "killall -0 haproxy"
    interval 2
    weight 2
}

vrrp_instance VI_1 {
    interface eth0
    state MASTER
    virtual_router_id 51
    priority 101
    virtual_ipaddress {
        192.168.1.100
    }
    track_script {
        chk_haproxy
    }
}
```

## Useful Commands

```bash
# Test configuration
haproxy -c -f /etc/haproxy/haproxy.cfg

# Reload with zero downtime
sudo systemctl reload haproxy

# View status
sudo systemctl status haproxy

# View logs
sudo tail -f /var/log/haproxy.log
```

## Summary

HAProxy is a powerful, production-ready load balancer. Key takeaways:

1. Start simple, then add complexity as needed
2. Always configure health checks
3. Use ACLs for flexible routing
4. Enable the stats page for monitoring
5. Combine with Keepalived for high availability

In the next article, we'll explore advanced HAProxy features and production best practices.
