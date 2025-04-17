This repository contains a multi-service application  designed to provide an interactive and user-friendly experience for managing firearms. The system consists of three interconnected microservices, each serving a specific purpose. Below is a detailed description of the architecture and components. 
Microservices Architecture 
1. CLI Application (Node.js) 

The CLI application is the primary interface for interacting with the API. It provides users with an interactive menu  to perform various operations such as: 

    Registering and logging in users.
    Managing firearms (loading, shooting, aiming, etc.).
    Viewing weapon states and performing maintenance.
     

Key Features: 

    Built using Node.js  and Inquirer.js  for a seamless interactive experience.
    Communicates with the API via Axios  for HTTP requests.
    Handles user authentication using JSON Web Tokens (JWT) .
    Includes logging functionality for better debugging and monitoring.
     

Why Node.js? 

Node.js was chosen for its lightweight nature , speed , and ease of development. It allows rapid prototyping and integration with other services. 
2. API Service (Node.js + Express + MongoDB) 

The API service acts as the backend for the entire system. It handles all business logic, database interactions, and user authentication. 
Key Features: 

    Built using Node.js  and Express.js  for handling HTTP requests.
    Uses MongoDB  as the database due to its simplicity, flexibility, and JSON-like structure, which aligns well with JavaScript objects.
    Implements Mongoose schemas  for structured data modeling.
    Provides RESTful endpoints for CRUD operations on firearms and user management.
    Authentication is implemented using JSON Web Tokens (JWT)  for secure access control.
     

Why MongoDB? 

MongoDB was chosen for its schema-less design , making it ideal for rapid development and scalability. Its JSON-like structure integrates seamlessly with Node.js. 
3. Frontend Application (HTML + CSS + JS + Nginx) 

The frontend application serves as a web-based alternative to the CLI tool. It provides a graphical user interface (GUI) for interacting with the API. 
Key Features: 

    Built using HTML , CSS , and JavaScript  for a responsive and intuitive UI.
    Hosted using Nginx , a lightweight and high-performance web server.
    Replicates the functionality of the CLI application but in a browser environment.
    Communicates with the API via AJAX  or Fetch API  for dynamic interactions.
     

Why Nginx? 

    Nginx was chosen for its high performance , low resource consumption , and ease of configuration for serving static files. 
    Dockerized Services 

MONGO , API , and Frontend  are containerized using Docker . This ensures consistency across different environments and simplifies deployme
