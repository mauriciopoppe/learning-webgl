var http = require('http')
var path = require('path')
var fs = require('fs')

var ecstatic = require('ecstatic')
var chokidar = require('chokidar')
var Router = require('http-hash-router')
var inject = require('inject-lr-script')
var browserify = require('browserify')
var fileExists = require('file-exists')
var beefy = require('beefy')

// live reload server
var tinylr = require('tiny-lr')
var lrServer = tinylr()
lrServer.listen(35729, function () {
  console.log('... LiveReload Listening on %s ...', 35729)
})

function serveBrowserify (req, res) {
  var base = path.dirname(req.url)
  var url = path.join(__dirname, base.substr(1), 'index.js')
  res.setHeader('content-type', 'text/javascript')

  var bundler = browserify({
    entries: [url],
    fullPaths: true,
    cache: {}
  })

  bundler.transform(require('babelify'))
  bundler.transform(require('brfs'))

  return bundler.bundle().pipe(res)
}

function serveIndex (req, res) {
  // if there's an index.html page on the dir serve that instead of the template
  var index = path.join(__dirname, req.url + 'index.html')
  if (!fileExists(index)) {
    index = path.join(__dirname, 'templates/index.html')
  }
  res = inject(res)
  fs.createReadStream(index).pipe(res)
}

function serveRoot (req, res) {
  return beefy({
    cwd: __dirname,
    entries: ['templates/root.js'],
    quiet: false,
    watchify: false
  })(req, res)
}

/**
 * dispatchs any requests to the respective handler
 */
function createHandler () {
  var router = Router()
  var staticHandler = ecstatic(process.cwd())

  router.set('/', serveRoot)
  router.set('/lessons/:lesson/', serveIndex)
  router.set('/lessons/:lesson/bundle.js', serveBrowserify)
  router.set('/lessons/:lesson/*', staticHandler)
  router.set('/*', serveRoot)

  return function (req, res) {
    router(req, res, {}, onError)

    function onError (err) {
      if (err) {
        res.statusCode = err.statusCode || 500
        res.end(err.message)
      }
    }
  }
}

function hardReload () {
  try {
    lrServer.changed({
      body: { files: '*' }
    })
  } catch (e) { throw e }
}

// main
// create a list of all the examples available
var files = fs.readdirSync(path.join(__dirname, 'lessons'))
var wstream = fs.createWriteStream('lessons.json')
wstream.end(JSON.stringify(files))

// server to handle the requests
http.createServer(createHandler()).listen(9696)
console.log('listening on http://localhost:9696')

// var log = console.log.bind(console)
chokidar
  .watch('book/**/index.js')
  .on('change', function (file) {
    console.log('changed: ' + file)
    hardReload()
  })
  .on('error', function (error) { log('Error happened', error) })
  .on('ready', function () {
    console.log('Initial scan complete. Ready for changes.')
  })
