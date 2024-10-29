# Inventrack

## Development

### Quick Links
- [Typescript docs](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeBox docs](https://github.com/sinclairzx81/typebox#types) (All the types that work for `Type.<type>()`)
- [Fastify docs](https://fastify.dev/docs/latest/Reference/)
- [Node.js v20 docs](https://nodejs.org/docs/latest-v20.x/api/index.html)
- [React v18 docs](https://react.dev/reference/react)
- [Shopify GraphQL API Docs](https://shopify.dev/docs/api/admin-graphql/2024-10/queries/product)

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
   > After running this, if you get IDE errors about the `'shared'` module not being found, you'll have to restart your Typescript service:
   > - In Webstorm, click ![Typescript 5.4.5](https://github.com/user-attachments/assets/153d729f-58c7-4e87-9e02-c617664f0161) in the bottom-right corner of the screen and then click 'Restart Typescript Service'.
   > - In VS Code, use <kbd>Cmd/Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>, then type 'Restart TS Server' and hit <kbd>Enter</kbd>. This only works if the editor is currently focused on a typescript file.
3. Create a `.env` file in the `/server` directory and populate it as follows, replacing `<the real token>` with the
    token that was given to you by a team member:
    ```dotenv
    ACCESS_TOKEN=<the real token>
    STORE_URL=quickstart-cae44a88.myshopify.com
    ```
4. Start the backend. We use [nodemon](https://www.npmjs.com/package/nodemon) to auto-reload when you make changes to the backend, you might just have to
   click into the backend terminal to trigger the reload.
    ```shell
    npm run backend
    ```
5. **In a new terminal**, start the frontend. Vite should auto-detect most changes and do a hot-reload for you so you don't
    need to manually re-run this command when you make changes, but on occasion it may fail and you'll need to manually
    re-run this.
    ```shell
   npm run frontend 
   ```

### Making Changes
When making changes that you want to save and share with the team, use the following steps:
1. Make a branch, if you haven't already (We don't want to push straight to main because that can get confusing and mess up peoples git history.)
   1. `git checkout -b <your branch name>`
2. Validate your code
   1. Lint your code: `npm run lint:fix` (from the project root)
   2. Build your code: `npm run build` (from the project root)
   3. (If we create any tests:) Test your code: `npm run test` (from the project root)
   > If anything fails, fix the errors. Feel free to ask for help on fixing things.
3. Commit your code
   1. Use `git status` to see changes and use `git add <file/folder>` to selectively stage changes you want to commit.
      Don't stage files you don't want to commit.
   2. Use `git commit -m <commit message>` to commit your changes. More, smaller commits is better than one large one,
       but it's not that big of a deal.
4. Push your code
   1. `git push` to create your branch in GitHub and send up your changes
       > Consider running `git config push.autoSetupRemote true` and then trying again if you get an error about needing to set your remote
   2. Git should print a link to the console, click on that. It will open in your browser and prompt you to create a PR!
      Send the Pr to a teammate or the team discord for a review and then merge it to main.
5. On your local machine, make sure to `git checkout main && git pull` after your branch has been merged. You can also
   run `git branch -D <your old branch name>` to delete it locally to clean up.

### Installing Dependencies
My least-favorite part about using [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) is that
installing dependencies is slightly more annoying than usual if you want to maintain the integrity of the lockfile
and project structure.

Normally you would just run `npm i <package_name>` and you can still do that if you want
to install a dependency for the top-level of the project, meaning that all three modules will have access to it.

If you just want to install a dependency for one of the modules (i.e. just the backend), this is how you do it. Run a
command like this from the top-level of the repository:
```shell
npm i --workspace=<workspace_name> <package_name>
```
e.g. `npm i --workspace=server axios` if I wanted to install axios in the backend module. The workspace names are just
the names of the directories.

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

### Full Stack Example
For an example of a what a route will look like with its backend implementation, shared types, and its frontend usage,
look at the `/add` example route:
- For the types, look at `/shared/src/model/add.model.ts`. Note how we export all of the needed exports in `/shared/src/index.ts`.
- For the backend implementation, look at `/server/src/routes/add/root.ts`.
  - Here you can see an example of how to mock a route while its still in development (using `Value.Create()`), but also
    a simple example of how to implement the route once we are done mocking that route.
- For the frontend implementation, look at `/web/src/client/add.ts` and the bottom of `/web/src/components/main.tsx`.

## Deployment
For now, we have no plans to deploy this anywhere. It can be run on a local computer for testing and presentation.
