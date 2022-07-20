const expect = require('chai').expect;
const CalculusService = require('../src/services/calculus');
const Operation = require('../src/models/operation')


describe('Calculus Service', function () {
  let calculusService
  beforeEach(function () {
    calculusService = new CalculusService();
  });
  it('should throw Error: Invalid input for empty input', function () {
    expect(calculusService.compute).to.match(/Invalid input/)
  });

  // (2*6-2*8)*
  it('should throw Error: Invalid input for empty input', function () {
    expect(() => calculusService.compute('(2*6-2*8)*')).to.throw(/Invalid operation - second operand not specified/)
  });

  // Set of unexpected string
  it('should throw Error: Invalid input for any set of unexpected string', function () {
    expect(() => calculusService.compute('rtyuiuy')).to.throw(/Error: Unexpected result/)
  });

  // __eval evaluates correctly
  it('should evaluate correctly for __eval', function () {
    expect(calculusService.__eval(2, '+', 2)).to.equal(4)
  });

  // __eval evaluates correctly
  it('should evaluate correctly for __eval', function () {
    expect(() => calculusService.__eval(2, '%', 2)).to.throw('Unsupported operator')
  });

  // calculateExpressionOperations evaluates correctly
  it('should throw if operation is not valid for calculateExpressionOperations', function () {
    const operation = new Operation
    operation.operator = null
    expect(() => calculusService.calculateExpressionOperations(operation)).to.throw('Invalid operation')
  });

  // (2*6-2*8)
  it('should evaluate correctly and not throw exception for (2*6-2*8)', function () {
    expect(() => calculusService.compute('(2*6-2*8)')).to.not.throw(/Invalid operation - second operand not specified/)
  });
  it('should evaluate correctly for (2*6-2*8)', function () {
    expect(calculusService.compute('(2*6-2*8)')).to.equal(-4)
  });

  it('should evaluate correctly for 2 * (23/(3*3))- 23 * (2*3)', function () {
    expect(calculusService.compute('2 * (23/(3*3))- 23 * (2*3)')).to.equal(-132.88888888888889)
  });

  it('should evaluate correctly for ((2 / 5) * 8 * (23 / (3 * 3))) - (23 * (2 * 3)) + ((9 * 2) + (3 * 2))', function () {
    expect(calculusService.compute('((2 / 5) * 8 * (23 / (3 * 3))) - (23 * (2 * 3)) + ((9 * 2) + (3 * 2))')).to.equal(-105.82222222222222)
  });

});