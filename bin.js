#!/usr/bin/env node
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

if (process.argv.length !== 5) {
  process.stdout.write(
    'Usage: <Publisher> <Password> <JSON File>\n'
  )
  process.exit(1)
}

var args = process.argv
  .slice(2, 5)
  .concat(function (error, location) {
    if (error) {
      if (error.statusCode) {
        console.error('Server responded ' + error.statusCode + '.')
      }
      console.error(error)
      process.exit(1)
    } else {
      console.log('https://api.commonform.org' + location + '\n')
      process.exit(0)
    }
  })

require('fs').readFile(args[2], function (error, buffer) {
  if (error) {
    console.error('Could not read: ' + args[2])
    process.exit(1)
  }
  var parsed
  try {
    parsed = JSON.parse(buffer)
  } catch (error) {
    console.error('Could not parse JSON file: ' + error.toString())
    process.exit(1)
  }
  args[2] = parsed
  require('./').apply(null, args)
})
