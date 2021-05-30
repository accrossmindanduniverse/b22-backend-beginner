module.exports = {
  response: function (res, status, data, statusCode) {
    const result = {
      data: '',
      statusCode: 200,
      status: false
    }
    result.data = data
    result.statusCode = statusCode
    result.status = status

    return res.status(result.statusCode).json({
      result: result.status,
      data: result.data
    })
  }
}
