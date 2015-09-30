var menu = require('browser-menu')({})
var files = require('../lessons.json')
files.shift()

menu.reset()
files.forEach(function (file) {
  menu.add(file)
})

menu.on('select', function (label) {
  menu.close()
  window.location = '/lessons/' + label + '/'
})
