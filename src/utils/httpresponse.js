'use strict'

module.exports = {
    error: (message) => {
       return { error: true, result: null, message }
    },
    success: (result) => {
        return { error: false, result, message: '' }
     }
}