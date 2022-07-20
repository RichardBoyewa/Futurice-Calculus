'use strict'

const Operation = require('../models/operation')

class CalculusService {
    constructor(){
        this.ops = ['+', '-', '*', '/', '(', ')']
        this.bodmas = ['/', '*', '+', '-'] // Order is very important
    }

    compute(input) {
        if(!input) { throw 'Invalid input'}
        const treatedInput = input.replace(/\s/g, '',).split('');
        let preparedData = this.prepareExpression(treatedInput)
        preparedData = this.normaliseExpression(preparedData)
        const f = this.applyBODMAS(preparedData, 0)
        if (f && f.length == 1) {
            return f[0]
        } else {
            throw 'Error: Unexpected result'
        }
    }

    prepareExpression(rawInput) {
        const treatedInputData = rawInput
        let j = 0
        let currentOps = [];
        let openComputeCount = 0;
        while (j < treatedInputData.length) {
            if (treatedInputData[j] == '(') {
                openComputeCount += 1
                currentOps = []
                j += 1;
                continue
            }

            if (treatedInputData[j] == ')' && openComputeCount > 0) {
                // compute begins
                openComputeCount -= 1
                if (currentOps.length > 0) {
                    const original_len = currentOps.length
                    const result = this.evaluateExpression(currentOps)
                    if (!result || result.length != 1) {
                        throw 'Unexpected Result'
                    }
                    let indxOpen = j - (original_len + 1)
                    treatedInputData.splice(indxOpen, original_len + 2, result[0]);

                    // reset j to when the last open bracket
                    while (treatedInputData[indxOpen] != '(' && openComputeCount > 0 && indxOpen > 0) {
                        indxOpen -= 1;
                    }
                    if (indxOpen >= 0) {
                        // Reset the index
                        j = indxOpen;
                    }
                    currentOps = [];
                    continue
                }
            }

            if (openComputeCount > 0) {
                currentOps.push(treatedInputData[j])
            }
            j += 1;
        }

        return treatedInputData
    }

    __eval(lhs, op, rhs) {
        if (op == '-') {
            return Number(lhs) - Number(rhs)
        } else if (op == '+') {
            return Number(lhs) + Number(rhs)
        }
        else if (op == '/') {
            return Number(lhs) / Number(rhs)
        }
        else if (op == '*') {
            return Number(lhs) * Number(rhs)
        }
        throw 'Unsupported operator'
    }

    evaluateExpression(expression) {
        return this.applyBODMAS(this.normaliseExpression(expression), 0)
    }

    normaliseExpression(expression) {
        let index = 0
        while (index < expression.length) {
            if (expression[index] == '-') {
                expression[index] = '+'
                expression[index + 1] = -1 * expression[index + 1]
            }
            index += 1
        }
        return expression
    }

    calculateExpressionOperations(opInstance) {
        // Lone item, so we return it
        if (opInstance.LHS.length == 0) {
            throw 'Invalid operation'
        }
        // Operator not found, usually this should have LHS OPERATOR RHS form
        if (!opInstance.operator) {
            if (opInstance.LHS.length == 0) {
                throw 'Invalid operation'
            }
            if (opInstance.RHS.length != 0) {
                throw 'Invalid operation - second operand not specified'
            }
            return Number(opInstance.LHS.join(''))
        }

        // Operator not found, usually this should have LHS OPERATOR RHS form
        if (opInstance.operator) {
            if (opInstance.LHS.length == 0) {
                throw 'Invalid operation - first operand missing'
            }
            if (opInstance.RHS.length == 0) {
                throw 'Invalid operation - second operand not specified'
            }
        }

        const lhs = opInstance.LHS.join('')
        const rhs = opInstance.RHS.join('')

        if (isNaN(lhs) || isNaN(rhs)) {
            throw 'Invalid operation'
        }
        return this.__eval(lhs, opInstance.operator, rhs)
    }

    applyBODMAS(params, opIndex) {
        let index = 0
        let operator = this.bodmas[opIndex]

        while (params[index] != operator && index < params.length) {
            index += 1
        }

        if (index < params.length) {
            let j = index
            let equatn = new Operation()
            equatn.operator = operator
            while (index >= 0) {
                index -= 1
                if (isNaN(params[index])) {
                    break
                }
                equatn.LHS.unshift(params[index])

            }
            while (j < params.length) {
                j += 1
                if (isNaN(params[j])) {
                    break
                }
                equatn.RHS.unshift(params[j])

            }

            const result = this.calculateExpressionOperations(equatn)
            params.splice(index + 1, j - index - 1, result)
            if (params.includes(equatn.operator)) {
                return this.applyBODMAS(params, opIndex)
            }
        }
        opIndex += 1
        if (opIndex < this.bodmas.length) {
            return this.applyBODMAS(params, opIndex)
        }
        return params
    }
}

module.exports = CalculusService