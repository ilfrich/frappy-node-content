const manageEndpoints = require("./dist/manage-endpoints")
const getEndpoints = require("./dist/get-endpoints")

module.exports = {
    registerAdminEndpoints: manageEndpoints.default,
    registerGetEndpoints: getEndpoints.default,
}
