---
title: Building a Load Balancer with Go
description: Learn how to implement a simple HTTP load balancer using Go
---

# Building a Load Balancer with Go

Load balancing is a critical component in distributed systems. In this article, we'll build a simple HTTP load balancer in Go from scratch.

## What is a Load Balancer?

A load balancer distributes incoming traffic across multiple servers to ensure no single server becomes overwhelmed. It also provides redundancy - if one server fails, traffic is routed to healthy servers.

## Basic Architecture

```
Client -> Load Balancer -> Backend Server 1
                      |-> Backend Server 2
                      |-> Backend Server 3
```

## Setting Up the Project

First, create the project structure:

```bash
mkdir loadbalancer
cd loadbalancer
go mod init loadbalancer
```

## Implementing the Load Balancer

```go
package main

import (
    "fmt"
    "io"
    "log"
    "net/http"
    "net/url"
    "sync"
)

// Server represents a backend server
type Server struct {
    URL    *url.URL
    Active bool
   mu     sync.RWMutex
}

// ServerPool manages backend servers
type ServerPool struct {
    servers []*Server
    current int
    mu      sync.Mutex
}

// Next returns the next server in the pool (Round Robin)
func (p *ServerPool) Next() *Server {
    p.mu.Lock()
    defer p.mu.Unlock()
    
    server := p.servers[p.current]
    p.current = (p.current + 1) % len(p.servers)
    return server
}

// AddServer adds a backend server to the pool
func (p *ServerPool) AddServer(address string) {
    u, err := url.Parse(address)
    if err != nil {
        log.Printf("Invalid server address: %s", address)
        return
    }
    p.servers = append(p.servers, &Server{URL: u, Active: true})
}

// HealthCheck performs health checks on all servers
func (p *ServerPool) HealthCheck() {
    for _, server := range p.servers {
        resp, err := http.Head(server.URL.String())
        if err != nil || resp.StatusCode >= 500 {
            server.SetActive(false)
            log.Printf("Server %s is DOWN", server.URL)
        } else {
            server.SetActive(true)
            log.Printf("Server %s is UP", server.URL)
        }
    }
}
```

## Handling Requests

```go
func (p *ServerPool) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    server := p.Next()
    
    // Proxy the request
    resp, err := http.Get(server.URL.String() + r.URL.Path)
    if err != nil {
        http.Error(w, "Backend error", http.StatusBadGateway)
        return
    }
    defer resp.Body.Close()
    
    // Copy response headers and body
    for k, v := range resp.Header {
        w.Header()[k] = v
    }
    w.WriteHeader(resp.StatusCode)
    io.Copy(w, resp.Body)
}
```

## Starting the Load Balancer

```go
func main() {
    pool := &ServerPool{}
    
    // Add backend servers
    pool.AddServer("http://localhost:8081")
    pool.AddServer("http://localhost:8082")
    pool.AddServer("http://localhost:8083")
    
    // Start health check goroutine
    go func() {
        ticker := time.NewTicker(30 * time.Second)
        for range ticker.C {
            pool.HealthCheck()
        }
    }()
    
    // Start load balancer
    fmt.Println("Load balancer listening on :8080")
    if err := http.ListenAndServe(":8080", pool); err != nil {
        log.Fatal(err)
    }
}
```

## Testing with cURL

```bash
# Start your backend servers on ports 8081, 8082, 8083
# Then test the load balancer
curl http://localhost:8080/
curl http://localhost:8080/api/users
```

## Improvements to Consider

This basic implementation can be enhanced with:

- **Weighted round robin** - Assign different weights to servers
- **Least connections** - Route to server with fewest active connections
- **IP hashing** - Consistent hashing for session persistence
- **SSL termination** - Handle HTTPS at the load balancer
- **Metrics** - Track request counts, latency, errors

## Using HAProxy in Production

For production environments, consider using established solutions like [HAProxy](https://www.haproxy.org/) which offer:

- Advanced load balancing algorithms
- Health checking
- SSL/TLS support
- Rate limiting
- Dashboard and monitoring

But building your own is excellent for learning! Stay tuned for more advanced topics.
