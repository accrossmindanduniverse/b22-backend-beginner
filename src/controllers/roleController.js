const helper = require('../helpers')
const roleModels = require('../models/role')

module.exports = {

  createRole: async function (req, res) {
    const setData = req.body
    try {
      const result = await roleModels.createRoles(setData)
      return helper.response(res, true, result, 200)
    } catch (err) {
      console.log(err)
      return helper.response(res, false, 'create role rejected', 400)
    }
  }

}
