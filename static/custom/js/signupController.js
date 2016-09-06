var module = angular.module('Signup', []);
module.controller('SignUpController', ['$http', '$scope', '$window',  function($http, $scope, $window) {
	$scope.specializations = [];
    $scope.getAllspecializations = function(){
        $http({
            method : "GET",
            url : "/specializations/",
            params:{queryStr:'bio'}
        }).then(function succes(response) {
            //$scope.specializations = response.data;
            //alert($scope.specializations)
        }, function error(response) {
            $scope.error = response.statusText;
        });
    }



    $scope.doSignup = function(doctor){
		$http({
        	method : "POST",
        	url : "/dosignup/",
        	headers: {
        			'Content-Type': 'application/x-www-form-urlencoded'
    			},
        	data:$.param({
        		title : doctor.title,
        		firstName: doctor.firstName,
        		lastName:doctor.lastName,
        		specialization:energy = doctor.specialization.join(),
        		addrLine1:doctor.line1,
        		addrLine2:doctor.line2,
        		postCode:doctor.postCode,
        		city:doctor.city,
        		mobile:doctor.mobile,
        		email:doctor.email,
        		website:doctor.website,
                userName:doctor.emailPhone,
                password:doctor.password

        	})
    	}).then(function mySucces(response) {
        	$scope.myWelcome = response.data;
    	}, function myError(response) {
        	$scope.myWelcome = response.statusText;
    	});
	}
}])