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
    - To see if you have nvm installed, run:
      ```shell
      nvm --version      
      ```
    - If you don't have it installed, use these links to install it:
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
    npm run build:shared
    ```
    > If you get IDE errors about the `'shared'` module not being found, you'll have to restart your Typescript service:
    > - In Webstorm, click ![Typescript 5.4.5](https://github.com/user-attachments/assets/153d729f-58c7-4e87-9e02-c617664f0161) in the bottom-right corner of the screen and then click 'Restart Typescript Service'.
    > - In VS Code, use <kbd>Cmd/Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>, then type 'Restart TS Server' and hit <kbd>Enter</kbd>. This only works if the editor is currently focused on a typescript file.
3. Start the backend. *If you make changes to the backend you'll have to kill it (<kbd>Ctrl</kbd>+<kbd>C</kbd>) and restart
    it with this command.*
    ```shell
    npm run backend
    ```
4. **In a new terminal**, start the frontend. Vite should auto-detect most changes and do a hot-reload for you so you don't
    need to manually re-run this command when you make changes, but on occasion it may fail and you'll need to manually
    re-run this.
    ```shell
   npm run frontend 
   ```

## Architecture
This app uses a CS340-Tweeter-esque monorepo architecture with a backend module, a frontend module,
and a third module for shared code, especially type definitions.

### Backend
The backend (`server/`) is written in [Typescript](https://www.typescriptlang.org/), uses the [Node.js](https://nodejs.org/en) v20
javascript runtime, and relies on the [Fastify](https://fastify.dev/) web server framework (the industry-standard replacement for Express).
This combination results in a speedy, modern, and type-safe backend.

### Frontend
For the frontend (`web/`), we're using the same frontend setup that is used in CS340, which uses [Vite](https://vitejs.dev) as
the development framework (building, hot-reload, etc.), [React](https://react.dev/) as the web framework library,
and [Typescript](https://www.typescriptlang.org/) again as the JS flavor.

### Type-safety
Compile-time and development type safety will be enforced by Typescript. We also want run-time type-safety in the backend
API calls, and this will be enforced by Fastify. Fastify uses [JSON Schema](https://json-schema.org/) for defining
the type definitions of requests and responses, which is standard for RESTful APIs.

**Since we don't want to have to write our types in both Typescript and JSON Schema**, we will use [TypeBox](https://github.com/sinclairzx81/typebox#readme)
which will export definitions in both formats so that we only have to write them once. We define these models in the 'shared'
directory (`shared/`), which the backend and frontend both import to access the type definitions.

## Deployment
For now, we have no plans to deploy this anywhere. It can be run on a local computer for testing and presentation.
