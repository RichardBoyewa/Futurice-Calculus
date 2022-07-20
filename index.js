const express = require('express')

/** Dependencies */
// In real world app, dependencies injection would be done via container service 
const CalculusService = require('./src/services/calculus')
const HomeController = require('./src/controllers')
// Utils
const HttpResponse = require('./src/utils/httpresponse')
const Parser = require('./src/utils/base64utils')
/**
 * Instantiate controller class with the needed dependencies
 */
const HomeControllerInstance = new HomeController(new CalculusService, HttpResponse, Parser)

const app = express()
app.use(express.json()) 
const port = process.env.PORT || 3000

app.get('/', (req, res) =>  HomeControllerInstance.compute(req, res))

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})