//var module = angular.module('healthcareWebApp', ['ui.bootstrap']);

module.directive('hcComboDiv', function () {
    return {
        restrict: 'E',
        replace: true,
        template: function (element, attrs) {
        
            //var form = cg.getPropertyOrDefault(attrs, "cgForm", "ciForm");
           // var field = cg.getPropertyOrDefault(attrs, "cgField", hpo);
            //var errors = cg.getPropertyOrDefault(attrs, "cgErrorMessages", "clinicalInfoHpoMessages");
            //return cgDirectives.inputTemplateSelect(form, field, errors, errors, "cg-hpo=''", "Select hpo terms", element);
        	return '<input type="text" name="'+attrs.name+'" hc-combo="" id="'+attrs.id+'" ></input>';
        	
        }
    	
    }
});

module.directive('hcCombo',['hcService','$http', function (hcService, $http) {
	return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
        	
        	/*results.push({
	              id: 'itme',
	              text: 'item'
	            });*/
        	$http.get(attrs.url, {
         	      params: {	queryStr:'y' }
         	    }).then(function(response){
         	    	
         	    	 var results = [];
   		          $.each(response.data, function(index, item){
   		            results.push({
   		              id: item,
   		              text: item
   		            });
   		          });
         	    	
         	    	 var selectParams = hcService.getRemoteMultiPagedConfig(element, ngModel, 'Select sp1 terms', true, "/specializations", 5, results);
                     
                     hcService.generateSelect2Box(element, selectParams, scope, ngModel, attrs.ngModel);
         	    });
           
            
           /* ngModel.$validators.mandatory = cgValidationService.generateMandatoryValidator(); 
           
            ngModel.$asyncValidators.existing = cgValidationService.generateAsyncValidator('rest/hpoterm/exists');*/
        }
    };
}]);

module.directive('ngSparkline', function() {
	  return {
	    restrict: 'E',
	    template: '<div class="sparkline">fgfgfgfg</div>'
	  }
	});

module.directive('hcCategoryTreeDiv', ['hcService', function (hcService) {
    return {
        restrict: 'E',
        replace: true,
        template: function (element, attrs) {
        
            
            //var errors = cg.getPropertyOrDefault(attrs, "cgErrorMessages", "clinicalInfoHpoMessages");
            return '<div  id="categoryTree" name="categoryTree"></div>';//cgDirectives.inputTemplateSelect(form, field, errors, errors, "cg-hpo=''", "Select hpo terms", element);
        },
        link: function (scope, element, attrs, ngModel) {
            hcService.generateDynatree(element,scope, ngModel, attrs.url);
            
        }
    }
}]);

module.directive('hcCkEditor', function () {
    return {
        restrict: 'EA',
        replace: true,
        require: '?ngModel',
        template: function (element, attrs) {
            
            return '<textarea id="contentEditor"></textarea>';
        },
        link: function (scope, element, attrs, ngModel) {
          var ck = CKEDITOR.replace(element[0], {height: 400});

            /*if (!ngModel){
              return;
            }

            ck.on('pasteState', function() {
              scope.$apply(function() {
                ck.removeAllListeners();
                CKEDITOR.remove(ck);
                ngModel.$setViewValue(ck.getData());

              });
            });

            ngModel.$render = function(value) {
              ck.setData(ngModel.$viewValue);
            };*/

               if (!ngModel) return;

              ck.on('instanceReady', function() {
                ck.setData(ngModel.$viewValue);
              });

              function updateModel() {
                  scope.$apply(function() {
                      ngModel.$setViewValue(ck.getData());
                  });
              }

              ck.on('change', updateModel);
              ck.on('key', updateModel);
              ck.on('dataReady', updateModel);

              ngModel.$render = function(value) {
                ck.setData(ngModel.$viewValue);
              };
        }
    }
});
/*module.directive('shCk', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
          var ck = CKEDITOR.replace(element[0],{toolbar : 'Basic'});

            if (!ngModel){
              return;
            }

            ck.on('pasteState', function() {
              scope.$apply(function() {
                ngModel.$setViewValue(ck.getData());
              });
            });

            ngModel.$render = function(value) {
              ck.setData(ngModel.$viewValue);
            };
        }
    };
});*/

