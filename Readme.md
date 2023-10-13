# Contact Manager Project Readme

## Project Overview

The Contact Manager project is a web application that allows users to manage their contacts. This README provides step-by-step instructions on how to set up and deploy the project.

## Backend

The backend of the Contact Manager project is built with Nest.js, TypeScript, Moralis, and MongoDB.

### Local Development

1. **Navigate to the `backend` directory.**

   ```shell
   cd backend

2. **Set up a webhook using Ngrok to allow external connections to your local server.**

   ```shell
   ngrok http 7000

Use the Ngrok webhook endpoint in the Setupstream function in app.service.ts file with the webhook endpoint.

3. **Install Dependencies**
```shell
npm install
//start the development server
npm run start:dev
```

## Frontend Overview

The frontend of the Contact Manager project is built with Next.js, TypeScript, Wagmi, Rainbowkit, React, Node-fetch, and Cache Manager. This part of the project provides a user-friendly interface for managing your contacts.

## Local Development

Follow these steps to set up the frontend for local development.

### Installation

1. **Navigate to the `frontend` directory.**

   ```shell
   cd frontend
   npm install
   npm run dev

front end port: localhost:2000

