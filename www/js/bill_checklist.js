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
      updateBill:function (billName, newBillName) {
        angular.forEach(bills, function (bill) {
          if (bill.name == billName){
            bill.name = newBillName
          }
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
                          "<span class='bill-checkbox'>" +
                            "<input value='{{bill.paid}}' ng-click=\"updateBill\" checked=\"{{bill.paid=='true' && 'checked' || ''}}\" type='checkbox' name='checkbox-{{bill.id}}' id='checkbox-{{bill.id}}' />" +
                          "</span>" +
                          "<span>" +
                            "<a class='clickable-bill' href='#bill-editor-{{bill.id}}'>" +
                              "<label for='checkbox-{{bill.id}}'>" +
                                "<span class='bill-name'>{{bill.name}}</span>" +
                                "<span class=\"{{bill.paid=='true' && 'bill-paid' || 'bill-not-paid'}}\"><i>{{bill.status}}</i></span>" +
                              "</label>" +
                            "</a>" +
                          "</span>" +
                          "<div id='bill-editor-{{bill.id}}' style='display:none'>" +
                            "<form novalidate class='simple-form'>" +
                              "<h5>Edit Bill</h5>" +
                              "<input type='text' ng-model='bill.name' /><br />" +
                              "<div style='padding:5px; text-align:center;'>" +
                                "<div><i><h7>some update message</h7></i></div>" +
                                "<button class='btn btn-default delete-btn' ng-click='deleteBill(bill.id)'>DELETE</button>" +
                              "</div>" +
                            "</form>" +
                          "</div>" +
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

    $scope.updateBill = function(billName, newBillName) {
        billsService.editBill(billName, newBillName);
    };

    $scope.deleteBill = function(id) {
      billsService.deleteBill(id);
    };

    $scope.changeBillStatusClass = function(billStatus){
      return billsService.changeBillStatusClass(billStatus);
    };

  }])
