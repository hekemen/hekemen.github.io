---
title: Go Concurrency Patterns
description: Master goroutines, channels, and concurrent programming in Go
---

# Go Concurrency Patterns

Concurrency is one of Go's standout features. This article explores practical patterns for writing concurrent Go programs.

## Goroutines

A goroutine is a lightweight thread managed by the Go runtime:

```go
func main() {
    // Regular function call
    doWork()
    
    // Goroutine - runs concurrently
    go doWork()
    
    // Anonymous function goroutine
    go func() {
        // do something
    }()
    
    // Wait for goroutines to finish
    time.Sleep(time.Second)
}
```

## Channels

Channels are the communication mechanism between goroutines:

### Unbuffered Channels

```go
ch := make(chan string)

// Sending (blocks until receiver is ready)
ch <- "hello"

// Receiving (blocks until sender is ready)
msg := <-ch
```

### Buffered Channels

```go
// Buffer of 10 elements
ch := make(chan string, 10)

ch <- "first"
ch <- "second"
```

## Worker Pool Pattern

Distribute work across multiple goroutines:

```go
func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        fmt.Printf("worker %d processing job %d\n", id, j)
        results <- j * 2
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)
    
    // Start 3 workers
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }
    
    // Send 5 jobs
    for j := 1; j <= 5; j++ {
        jobs <- j
    }
    close(jobs)
    
    // Collect results
    for a := 1; a <= 5; a++ {
        <-results
    }
}
```

## Pipeline Pattern

Chain operations together:

```go
func generate(nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        for _, n := range nums {
            out <- n
        }
        close(out)
    }()
    return out
}

func square(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        for n := range in {
            out <- n * n
        }
        close(out)
    }()
    return out
}

func main() {
    // Pipeline: generate -> square -> print
    for n := range square(square(generate(2, 3, 4))) {
        fmt.Println(n)
    }
}
```

## Fan-Out, Fan-In

Distribute work to multiple goroutines and collect results:

```go
func merge(cs ...<-chan int) <-chan int {
    out := make(chan int)
    var wg sync.WaitGroup
    
    output := func(c <-chan int) {
        for n := range c {
            out <- n
        }
        wg.Done()
    }
    
    wg.Add(len(cs))
    for _, c := range cs {
        go output(c)
    }
    
    go func() {
        wg.Wait()
        close(out)
    }()
    return out
}
```

## Context for Cancellation

Use `context.Context` to coordinate cancellation:

```go
func fetchData(ctx context.Context, url string) ([]byte, error) {
    req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)
    
    client := &http.Client{Timeout: time.Second}
    resp, err := client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()
    
    return io.ReadAll(resp.Body)
}

func main() {
    ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
    defer cancel()
    
    data, err := fetchData(ctx, "https://api.example.com/data")
    if err != nil {
        fmt.Println("Error:", err)
        return
    }
    fmt.Println(string(data))
}
```

## Select Statement

Wait on multiple channels:

```go
select {
case msg := <-ch1:
    fmt.Println("Received from ch1:", msg)
case msg := <-ch2:
    fmt.Println("Received from ch2:", msg)
case <-time.After(time.Second):
    fmt.Println("Timeout!")
default:
    fmt.Println("No message available")
}
```

## Mutex for Shared State

Protect shared resources with `sync.Mutex`:

```go
type Counter struct {
    mu    sync.Mutex
    value int
}

func (c *Counter) Increment() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.value++
}

func (c *Counter) Get() int {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.value
}
```

Or use `sync.RWMutex` for read-heavy workloads:

```go
type Counter struct {
    mu    sync.RWMutex
    value int
}

func (c *Counter) Get() int {
    c.mu.RLock()
    defer c.mu.RUnlock()
    return c.value
}
```

## Once for Initialization

Ensure code runs only once:

```go
var (
    instance *Database
    once     sync.Once
)

func getDatabase() *Database {
    once.Do(func() {
        instance = &Database{}
        instance.Connect()
    })
    return instance
}
```

## WaitGroup for Coordination

Wait for a group of goroutines:

```go
func main() {
    var wg sync.WaitGroup
    
    for i := 1; i <= 5; i++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            fmt.Printf("Worker %d started\n", id)
            time.Sleep(time.Second)
            fmt.Printf("Worker %d finished\n", id)
        }(i)
    }
    
    wg.Wait() // Blocks until all workers finish
    fmt.Println("All workers done")
}
```

## Best Practices

1. **Don't create goroutines in libraries** - Let the caller decide concurrency
2. **Keep the main function alive** - Or goroutines won't run
3. **Close channels when done** - Prevents goroutine leaks
4. **Use buffered channels when possible** - Reduces blocking
5. **Handle errors** - Don't ignore them in goroutines
6. **Use context for cancellation** - Standard way to coordinate shutdown

## Summary

Go's concurrency model is elegant and powerful:

- **Goroutines** - Lightweight concurrent functions
- **Channels** - Communication and synchronization
- **sync package** - Traditional synchronization primitives
- **context** - Cancellation and deadlines

Practice these patterns to write efficient, concurrent Go programs!
