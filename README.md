# Inventrack

## Development

### Quick Links
- [Typescript docs](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeBox docs](https://github.com/sinclairzx81/typebox#types) (All the types that work for `Type.<type>()`)
- [Fastify docs](https://fastify.dev/docs/latest/Reference/)
- [Node.js v20 docs](https://nodejs.org/docs/latest-v20.x/api/index.html)
- [React v18 docs](https://react.dev/reference/react)

### Prerequisites
To develop this project, you must have the following installed on your computer:
- Node.js v20
  - We recommend using `nvm` or `nvm-windows` (Node Version Manager) to install this version of Node.js:
    - To see if you have nvm installed, run `nvm --version`. If you don't, you can install it here:
      ```shell
      nvm --version      
      ```
      - Windows: [https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows?tab=readme-ov-file#installation--upgrades)
      - Mac/Linux: [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)
    - Once you have nvm working, run the following to install and switch to Node.js v20:
    ```shell
    nvm install 20 && nvm use 20
    ```

### Running Locally
1. In the top-level of the repo, run `npm i` to install dependencies for the project. This will also install the
    dependencies for the frontend, backend, and shared modules.
    ```shell
    npm i
    ```
2. Build the shared module. *Anytime you change the types, you will have to re-run this command.*
    ```shell
    npm run build-shared
    ```
3. Start the backend. If you make changes to the backend you'll have to kill it (<kbd>Ctrl</kbd>+<kbd>C</kbd>) and restart
    it with this command.
    ```shell
    npm run backend
    ```
4. _In a new terminal_, start the frontend. Vite should auto-detect most changes and do a hot-reload for you so you don't
    need to manually re-run this command when you make changes, but on occasion it may fail and you may need to manually
    re-run this.
    ```shell
   npm run frontend 
   ```

## Architecture
This app uses a CS340-Tweeter-esque monorepo architecture with a Node.js/TS/Fastify backend, a React/TS/Vite frontend,
and a third module for shared code, especially Types.

### Backend
This is a [Typescript](https://www.typescriptlang.org/) backend that uses the [Node.js](https://nodejs.org/en) v20
javascript runtime and the [Fastify](https://fastify.dev/) web server framework (the industry-standard replacement for Express).

### Frontend
We're using the same frontend setup that is used in CS340, which uses [Vite](https://vitejs.dev) as
the development framework (building, hot-reload, etc.), [React](https://react.dev/) as the web framework library,
and [Typescript](https://www.typescriptlang.org/) as the JS flavor.

### Type-safety
Compile-time and development type safety will be enforced by Typescript. We also want run-time type-safety in the backend
API calls, and this will be enforced by Fastify, the backend server framework. Fastify uses JSON Schema for defining
the types of requests and responses, which is standard for RESTful APIs.

**Since we don't want to have to write our types in both Typescript and JSON Schema**, we will use [TypeBox](https://github.com/sinclairzx81/typebox#readme)
which will export types in both formats so that we only have to write them once. We define these models in the 'shared'
directory, which the backend and frontend both import to access the type definitions.

### Deployment
For now, we have no plans to deploy this anywhere. It can be run on a local computer for testing and presentation.
