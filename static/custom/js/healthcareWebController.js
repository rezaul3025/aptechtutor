//module = angular.module('healthcareWebApp', ['ui.bootstrap']);
module.controller('HealthcareWebController', ['$http', '$scope', '$window',  function($http, $scope, $window) {
	/*$scope.getSearchKey = function(){
		var key = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
		
		return key;
	}*/
	$scope.simplesearchViewTh = true;
	$scope.simplesearchViewThList = false;

	$scope.changeSimpleSearchView = function(){
		if($scope.simplesearchViewTh){
			$scope.simplesearchViewTh = false;
		}
		else{
			$scope.simplesearchViewTh = true;
		}

		if($scope.simplesearchViewThList){
			$scope.simplesearchViewThList = false;
		}
		else{
			$scope.simplesearchViewThList = true;
		}
	}

	$scope.getSearchKey = function(val) {
    return $http.get('/getsearchautocomplete/', {
      params: {
        queryStr: val
      }
    }).then(function(response){
      	return response.data;
    });
  };

  $scope.getSimpleResult = function(item, model, label, event){
	  
	  $window.location.href = '/simplesearch?queryStr='+item+"&page=1";
  	/* $http({
            method : "GET",
            url : "/simplesearch/",
            params:{queryStr:item,
            		page:1}
        }).then(function succes(response) {
            $scope.simpleSearchResults = response.data;
            //alert($scope.simpleSearchResults)
        }, function error(response) {
           // $scope.error = response.statusText;
        });*/
  };
  
  $scope.ratingPointsArr = [{"point":1, "isActive":false},
                         {"point":2, "isActive":false},
                         {"point":3, "isActive":false},
                         {"point":4, "isActive":false},
                         {"point":5, "isActive":false}]
 
  $scope.ratingPointchnage = function(value, point, search){
	  search['ratingPoints'] = point;
	  $scope.ratingPoints = point;
	  if(!value){
		  for(var r=$scope.ratingPoints;r<$scope.ratingPointsArr.length;r++){
			  $scope.ratingPointsArr[r].isActive = value;
		  }   
	  }
	  else{
		  for(var r=0; r<$scope.ratingPoints;r++){
			  $scope.ratingPointsArr[r].isActive = value;
		  }
		  
		  alert(search.ratingPoints);  
		  window.location.href = '/advancesearch?specializationsStr='+search.specialization+'&cityStr='+search.city+'&ratingPoints='+search.ratingPoints+'&page=1';
	  }
  }
  
  $scope.search = function(search, ratingPoints){
	
	  search['ratingPoints'] = ratingPoints;
	  //alert(search.ratingPoints);
	  $window.location.href = '/advancesearch?specializationsStr='+search.specialization+'&cityStr='+search.city+'&ratingPoints='+search.ratingPoints+'&page=1';
  };
  $scope.search.specialization = 'bio';
  $scope.getAdvanceSearchParams = function(search){
	  $http.get('/getadvancedsearchparams/', {
	      params: { }
	    }).then(function(response){
	    	search.specialization = response.data.specializations;
	    	search.city = response.data.cities;
	    	search.ratingPoints = response.data.ratingPoints;
	    	//$scope.ratingPointchnage(true,search.ratingPoints, search);
	    	$scope.ratingPoints = response.data.ratingPoints;
	    });
	  
	  //$scope.ratingPointchnage(true,search.ratingPoints, search);
  }
}])