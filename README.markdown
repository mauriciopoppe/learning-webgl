# Learning WebGL

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

My notes on learning raw WebGL, all the examples use [TWGL.js](http://twgljs.org/) to make the interaction with WebGL a little bit less verbose 

All the examples are written in es6 therefore shaders are written on the source file (multiline strings) instead of using additional script tags!

Workflow

- watch all the `index.js` files inside `book`
- if a file content changes the file is browserified with `browserify /path/to/index.js -d -o /path/to/parent/bundle.js -t babelify`
- after the bundled file is generated the webpage is reloaded thanks to `tiny-lr`

## Installation

Clone this repo and run

```sh
npm install
```

Then start an static server + tiny-lr server

```sh
npm start
```

Open `http://localhost:9696` and navigate to any of the examples located in `book`

## License

2015 MIT © Mauricio Poppe
