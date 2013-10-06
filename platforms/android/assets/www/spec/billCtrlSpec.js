describe('billCtrl', function() {

    it('should create "bills" model with 3 bills', function() {
      var scope = {},
        ctrl = new billCtrl(scope);

      expect(scope.bills.length).toBe(3);
    });

});