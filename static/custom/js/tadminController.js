module.controller('tadminController', ['$http', '$scope', '$window', 'hcService', function($http, $scope, $window, hcService) {
	
  $scope.addCategory =  function(category){
    /*$http({
          method : "POST",
          url : "/addcategory/",
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          data:$.param({
            'category' : category
          })
      }).then(function mySucces(response) {
          alert(response.data);
      }, function myError(response) {
          
      });*/
      alert($scope.contentEditor);
      hcService.addNewCategory(category);
  };

	$scope.getSearchKey = function(val) {
    return $http.get('/getsearchautocomplete/', {
      params: {
        queryStr: val
      }
    }).then(function(response){
      	return response.data;
    });
  };


}])