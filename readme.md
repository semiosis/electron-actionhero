# Electron-Actionhero

The goal of this project is to have a desktop application built with Electron where all the real work happens in the bundled Actionhero.

This project supports a multiprocess architecture with multiple actionheros running in background browserwindows.  They all share a single fakeredis by way of
 electron's remote module.  To disable the background processes set NUM_BACKGROUND_PROCS to 0 in index.js.

To demonstrate the multiprocess architecture I have created a task in `actionhero/tasks/check.js` which runs about every second.
The task scheduler is running in the electron main process actionhero instance.  It queues the task for running every second.
Background workers are watching the queue to execute the tasks.  Watch the logs to see the background workers collaborating to run tasks from the queue.

## Background info

Notable files:

- `index.js`: set up application and start main process
- `bg.html`: main entry point for the background worker processes
- `actionhero/config/redis.js`: manage fakeredis module via electron remote

How this project was bootstrapped:

- Started with [electron-boilerplate](https://github.com/sindresorhus/electron-boilerplate)
- Installed [actionhero](http://www.actionherojs.com/) via NPM
- Generated the sample Actionhero project structure and moved it into the `actionhero` directory
- Edited the resource paths in `chat.html` to be relative to that file
- Set the hostname for Actionhero server to `http://localhost:8080` in `chat.html`

New code written to boot actionhero (in `/index.js`):

- `extractActionhero()`: extracts `/actionhero` to a [user-writable appData folder](https://github.com/electron/electron/blob/master/docs/api/app.md#appgetpathname).  see [actionhero/readme.md](actionhero#actionhero-project) for details.
- `startActionhero(callback)`: sets `PROJECT_ROOT` environment variable to extracted folder then starts up actionhero, which runs `callback` when finished booting.
- Hooked actionhero startup into the electron `ready` event and delayed creating the main window until after actionhero is started
- Pointed the main window at `actionhero/public/chat.html` in the extracted folder

## Dev

```
$ npm install
```

### Run

```
$ npm start
```

### Build

Package without using ASAR

```
$ npm run build
```

Package using ASAR

```
$ npm run build-asar
```


Builds the app for macOS-x64, using [electron-packager](https://github.com/electron-userland/electron-packager).

Will expand support for Windows & Linux soon.

## Acknowledgements

Many thanks to the Actionhero community.  We worked together to fix a couple bugs that had prevented actionhero from running in an ASAR package.  See [release notes](https://github.com/evantahler/actionhero/releases/tag/v13.4.3) for details.

Thanks also to Github for Electron and, well, for Github.

## License

MIT © [Louis Zuckerman](http://github.com/semiosis)
