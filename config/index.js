'use strict'

const mysql = require('mysql')
const env = process.env.NODE_ENV || 'development'
const config = require(`./${env}`)
const dbName = `${env}`
const createTable =
` 
  CREATE DATABASE IF NOT EXISTS ${dbName};
  USE ${dbName};
  CREATE TABLE IF NOT EXISTS talentTable(
    keyCol varchar(100) UNIQUE,
    valCol varchar(100)
  ) 
  WITH SYSTEM VERSIONING;
`

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  multipleStatements: true
})

db.connect(function (err) {
  if (err) throw err
  console.log(`Created ${dbName} database !`)
})

db.query(createTable, function (err, result) {
  if (err) throw err
  console.log(`Created ${dbName} table !`)
})

global.db = db
module.exports = config
