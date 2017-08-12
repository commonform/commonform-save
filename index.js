/* Copyright 2017 Kyle E. Mitchell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
