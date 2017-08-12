var https = require('https')

module.exports = function save (publisher, password, form, callback) {
  https.request({
    method: 'POST',
    host: 'api.commonform.org',
    path: '/forms',
    headers: {
      'Content-Type': 'application/json'
    },
    auth: publisher + ':' + password
  })
    .once('response', function (response) {
      var status = response.statusCode
      if (status === 201 || status === 204) {
        done(null, response.headers.location)
      } else {
        var buffer = []
        response
          .on('data', function (chunk) {
            buffer.push(chunk)
          })
          .once('error', function (error) {
            done(error)
          })
          .once('end', function () {
            var body = Buffer.concat(buffer)
            var error = new Error(body.toString())
            error.statusCode = status
            done(error)
          })
      }
    })
    .once('error', function (error) {
      done(error)
    })
    .once('aborted', function () {
      done(new Error('server aborted'))
    })
    .end(JSON.stringify(form))

  var calledBack = false

  function done (error, result) {
    if (!calledBack) {
      calledBack = true
      callback(error, result)
    }
  }
}
