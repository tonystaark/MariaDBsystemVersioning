'use strict'

module.exports = {
  postObject: (req, res) => {
    let value, key
    for (let i in req.body) {
      value = req.body[i]
      key = i
    }
    const values = [key, value]
    const createData =
    `
      INSERT INTO talentTable(keyCol, valCol) VALUES (?) ON DUPLICATE KEY UPDATE valCol=?;
      SELECT keyCol, valCol, UNIX_TIMESTAMP(ROW_START) from talentTable;
    `
    db.query(createData, [values, value], (err, result) => {
      if (err) {
        res.status(500).json({ 'error': err, 'response': null })
        throw err
      } else {
        const length = result[1].length - 1
        res.json({
          'key': result[1][length].keyCol,
          'value': result[1][length].valCol,
          'timestamp': result[1][length]['UNIX_TIMESTAMP(ROW_START)']
        })
      }
    })
  },
  getObject: (req, res) => {
    let getData, sentData
    if (req.query.timestamp) {
      getData = `SELECT valCol, UNIX_TIMESTAMP(ROW_START) from talentTable FOR SYSTEM_TIME ALL where keyCol IN (?) AND UNIX_TIMESTAMP(ROW_START) <= ? ORDER BY UNIX_TIMESTAMP(ROW_START) DESC LIMIT 1;`
      sentData = [req.params.key, req.query.timestamp]
    } else {
      getData = `SELECT valCol from talentTable where keyCol IN (?)`
      sentData = req.params.key
    }
    
    db.query(getData, sentData, (err, result) => {
      if (err) {
        res.status(500).json({ 'error': err, 'response': null })
        throw err
      } else {
        res.json({'value': result[0].valCol})
      }
    })
  }
}
