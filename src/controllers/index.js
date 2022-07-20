'use strict'

class HomeController {
    constructor(calculusService, httpResponse, Parser ) {
        this.calculusService = calculusService
        this.httpResponse = httpResponse
        this.Parser = Parser
    }

    compute (request, response) {
        try {
            const { query } = request.query
            if(!query) {
                throw 'No expression passed!'
            }
            const input = this.Parser.parseB64(query)
            const result = this.calculusService.compute(input)
            if(result) {
                return response.json(this.httpResponse.success(result))
            }
        } catch (error) {
            return response.json(this.httpResponse.error(error))
        }
        return response.json(this.httpResponse.error('Unable to compute this :-('))
    }
}

module.exports = HomeController