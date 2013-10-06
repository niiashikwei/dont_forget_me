angular.module('billChecklist', ['ui.bootstrap', 'LocalStorageModule'])
  .service('billsService', function(){

    var bills = []

    if(typeof(Storage)!=="undefined"){
      if (localStorage.bills){
        storedBills = JSON.parse(localStorage.bills);
        bills = storedBills
      }
    }else{
      alert("your browser doesn't support local storage, this app save your progress!");
    }

    function updateLocalStorage() {
      localStorage.bills = JSON.stringify(bills)
    }

    return {
      bills:function () {
        return bills;
      },
      addBill:function (billName) {
        console.log("hello");
        var currentIndex = bills.length + 1;
        bills.push({
          id:currentIndex, name:billName, status:"not paid", paid:"false"
        });
        updateLocalStorage();
      },
      deleteBill:function (id) {
        var oldBills = bills;
        bills = [];

        angular.forEach(oldBills, function (bill) {
          if (bill.id !== id) bills.push(bill);
        });
        updateLocalStorage();
      },
      updateBillStatus:function (id) {
        console.log("hi");
        angular.forEach(bills, function (bill) {
          if (bill.id == id){
            if(bill.paid == true){
              bill.status = "paid"
            }else{
              bill.status = "not paid"
            }
          }
        });
        updateLocalStorage();
      }
    };
  })
  .directive('myBills', function ($log) {
    var template =  "<fieldset class='bill-container' data-role='controlgroup'>" +
                      "<div ng-repeat='bill in bills' class=\"bill btn\"  ng-class=\"{true:'btn-success', false:'btn-danger'}[bill.paid]\">" +
                        "<my-bill delete='deleteBill(bill.id)' bill='bill'>" +
                          "<span class='bill-checkbox'>" +
                            "<input ng-change='updateBillStatus(id)' ng-model='bill.paid' ng-checked=\"{{bill.paid=='true' && 'checked' || ''}}\" type='checkbox' name='checkbox-{{bill.id}}' id='checkbox-{{bill.id}}' />" +
                          "</span>" +
                          "<span>" +
                            "<a class='clickable-bill' href='#bill-editor-{{bill.id}}'>" +
                              "<label for='checkbox-{{bill.id}}'>" +
                                "<span class='bill-name'>{{bill.name}}</span>" +
                                "<span class=\"{{bill.paid=='true' && 'bill-paid' || 'bill-not-paid'}}\" ng-bind='bill.status'></span>" +
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

    $scope.deleteBill = function(id) {
      billsService.deleteBill(id);
    };

    $scope.updateBillStatus = function(id){
      billsService.updateBillStatus(id);
    };
  }])