#!/usr/bin/env node
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
