'use strict'

class Operation {
    constructor () {
        this.operator = null
        this.LHS = []
        this.RHS = []
    }
    // Returns the total let of this operation
    getLen () {
        return this.LHS.length + this.RHS.length + 1 // operator
    }
}

module.exports = Operation