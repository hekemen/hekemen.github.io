---
title: Getting Started with Go
description: A beginner's guide to learning Go programming language
---

Go (or Golang) is a statically typed, compiled programming language designed at Google. It's known for its simplicity, concurrency support, and excellent performance.

## Why Learn Go?

Go offers several advantages that make it a great choice for modern development:

- **Fast compilation and execution** - Go compiles to machine code, making it extremely fast
- **Built-in concurrency** - Goroutines and channels make parallel programming simple
- **Garbage collection** - Automatic memory management like in higher-level languages
- **Strong standard library** - Comprehensive packages for common tasks
- **Simple syntax** - Easy to read and maintain

## Your First Go Program

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

To run this program, save it as `main.go` and execute:

```bash
go run main.go
```

## Variables and Types

Go is statically typed, but you can use type inference for brevity:

```go
// Explicit type
var name string = "John"

// Type inference
age := 25 // inferred as int

// Multiple variables
x, y := 10, 20
```

## Concurrency with Goroutines

One of Go's most powerful features is lightweight concurrency via goroutines:

```go
func fetchData(url string, ch chan<- string) {
    // Simulate fetching data
    result := "Data from " + url
    ch <- result
}

func main() {
    ch := make(chan string)
    
    go fetchData("https://example.com", ch)
    go fetchData("https://golang.org", ch)
    
    // Receive from channel
    fmt.Println(<-ch)
    fmt.Println(<-ch)
}
```

## Packages and Imports

Go organizes code into packages. The standard library provides many useful packages:

```go
import (
    "fmt"
    "net/http"
    "encoding/json"
)
```

## Next Steps

Now that you understand the basics, explore these topics:

1. Error handling in Go
2. Interfaces and polymorphism
3. Working with databases
4. Building web applications with net/http
5. Testing in Go

Happy coding!
