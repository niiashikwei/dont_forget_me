angular.module('billChecklist', ['ui.bootstrap'])
  .service('billsService', function(){
    var bills =[
      {"id": 1, "name": "bill 1", "status": "paid", "paid": "true"},
      {"id": 2, "name": "bill 2", "status": "not paid", "paid": "false"},
      {"id": 3, "name": "bill 3", "status": "paid", "paid": "true"},
      {"id": 4, "name": "bill 4", "status": "paid", "paid": "true"},
      {"id": 5, "name": "bill 5", "status": "not paid", "paid": "false"},
      {"id": 6, "name": "bill 6", "status": "paid", "paid": "true"}
    ];

    return {
      bills:function () {
        return bills;
      },
      addBill:function (billName) {
        var currentIndex = bills.length + 1;
        bills.push({
          id:currentIndex, name:billName, status:"not paid", paid:"false"
        });
      },
      deleteBill:function (id) {
        var oldBills = bills;
        bills = [];

        angular.forEach(oldBills, function (bill) {
          if (bill.id !== id) bills.push(bill);
        });
      },
      changeBillStatusClass:function(id){
        console.log("got into method");

        angular.forEach(bills, function (bill) {
          if (bill.id !== id){
            if(bill.paid == 'false'){
              bill.status = "paid";
              bill.paid = "true";
              console.log("changing to paid");
              return;
            }
            else{
              bill.status = "not paid";
              bill.paid = "false";
              console.log("changing to 'not paid'");
              return;
            }
          }
        });
      }
    };
  })
  .directive('myBills', function ($log) {
    var template =  "<fieldset class='bill-container' data-role='controlgroup'>" +
                      "<div ng-repeat='bill in bills' class=\"bill btn {{bill.paid=='true' && 'btn-success' || 'btn-danger'}}\">" +
                        "<my-bill delete='deleteBill(bill.id)' bill='bill'>" +
                          "<input value='{{bill.paid}}' ng-click=\"updateBill\" checked=\"{{bill.paid=='true' && 'checked' || ''}}\" type='checkbox' name='checkbox-{{bill.id}}' id='checkbox-{{bill.id}}' class='bill-checkbox' />" +
                          "<label for='checkbox-{{bill.id}}'>" +
                            "<span class='bill-name'>{{bill.name}}</span>" +
                            "<span class=\"{{bill.paid=='true' && 'bill-paid' || 'bill-not-paid'}}\"><i>{{bill.status}}</i></span>" +
                          "</label>" +
                       "</my-bill>" +
                      "</div>" +
                    "</fieldset>"

    return {
      restrict:"E",
      scope:{
        bills:'=',
        ondelete:'&'
      },
      template:template,
      controller:function ($scope, $attrs) {
        $scope.deleteBill = function (id) {
          $scope.ondelete({id:id});
        }
      }
    };
  })
  .controller('billCtrl', ['$scope', 'billsService', function($scope, billsService){

    $scope.getBills = function() {
      return billsService.bills();
    };

    $scope.addBill = function(billName) {
      if(billName != '') {
        billsService.addBill(billName);
      }
    };

    $scope.deleteBill = function() {
      billsService.deleteBill(id);
    };

    $scope.changeBillStatusClass = function(billStatus){
      return billsService.changeBillStatusClass(billStatus);
    };

  }])
