# Salimon Web App Project

this is the web application source of salimon project. it's one of variouse clients in salimon network. (for more information about salimon network you can read in [protocol documents](https://salimon.ir/docs)). this projects is based on ReactJS library and uses TypeScript as development language. you'll need `NodeJS` and `Yarn` package manager to start this project.

## Install Project Dependecies

after cloning the project from git repository, just head into the root directory of project and execute this command:

```
yarn
```

## Run the Project

after installing all required packages. you can start the project. this webapp has two separate thread. and they both must be running while you are developing the project. the first thread is the front thread which is responsible for all UI components, containers and anything else that user can see. you have to start this thread by executing:

```
yarn start
```

> PWA methods are activated in this project so the biggest problem in development is caching. `localhost` is in exception list for caching so you don't have to use custom local dns and domains for this project.

the second thread is the core thread and is responsible for connections, queues, background services, encryptions all other long-term-and-freezing operations. you can execute this thread by running:

```
yarn worker
```

this thread will watch `/src/Worker` directory for any change then compiles and bundles it into `/public/worker.js`, UI thread is using this worker and comunicating with it.

> if you are not going to work on core thread, then you don't need to run it. the latest version `/public/worker.js` is always there and you can use it in UI thread.

## Build the Project

after working on project. you can build and bundle it in a single js-html-css directory. just execute this command:

```
yarn run build
```

this command will bundle the project build into `/build` direcotry in root of the project. you can serve it by `serve` command in nodejs or using any webserver application/service you prefer.

## Test the Project

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Pending Technical Debts

- use custom hook for context variables
