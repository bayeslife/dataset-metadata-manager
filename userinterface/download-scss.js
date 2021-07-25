const http = require('https')
const fs = require('fs')

var options = {
  host: 'localhost',
  port: 3007,
  path: 'styles',
  // These next three lines
  rejectUnauthorized: false,
  requestCert: true,
  agent: false,
}

function download(filename, host, port, url) {
  var file = fs.createWriteStream(filename)
  http.get({ ...options, host: host, port: port, path: url }, function (response) {
    response.pipe(file)
  })
}

console.log('Downloading scss')
download('./src/styles/TablePagerContainer.scss', 'localhost', 3007, '/styles/TablePagerContainer.scss')
download('./src/styles/SelectTags.scss', 'localhost', 3007, '/styles/SelectTags.scss')
download('./src/styles/Toolbar.scss', 'localhost', 3007, '/styles/Toolbar.scss')

console.log('Finished Downloading scss')
