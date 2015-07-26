var http = require('http')
var handler = require('ecstatic')(process.cwd())
var chokidar = require('chokidar')
var spawn = require('npm-execspawn')
var path = require('path')
var inject = require('inject-lr-script')

// live reload server
var tinylr = require('tiny-lr')
var lrServer = tinylr()
lrServer.listen(35729, function () {
  console.log('... LiveReload Listening on %s ...', 35729)
})

// static server
http.createServer(function (req, res) {
  return handler(req, inject(res))
}).listen(9696)
console.log('listening on http://localhost:9696')

function runBrowserify (entry) {
  var dest = path.dirname(entry) + '/bundle.js'
  var cmd = ['browserify', entry,
    '-d',
    '-t', 'babelify',
    '-o', dest
  ].join(' ')
  console.log('running: ' + cmd)
  var proc = spawn(cmd)
  proc.on('close', function () {
    console.log('finished writing: ' + dest)
    lrServer.changed({
      body: {
        files: '*'
      }
    })
  })
}

var log = console.log.bind(console)
chokidar
  .watch('book/**/index.js')
  .on('add', runBrowserify)
  .on('change', function (file) {
    log('changed: ' + file)
    runBrowserify(file)
  })
  .on('error', function (error) { log('Error happened', error) })
  .on('ready', function () { log('Initial scan complete. Ready for changes.') })
