var module = angular.module('aptechtutor',['ui.bootstrap']);

module.factory('hcService', ['$timeout','$http', function ($timeout, $http) {
    return new Service($timeout, $http);
}]);
var Service = (function () {

    var httpOb;
    var selectedNode;
    var localUrl;
    var changePath = false;
    var previousPath = null;
    var selectedContentId = null;

    function Service(timeout, http) {
        var _this = this;
        this.triggerValidation = function (ngModel, scope) {
            if (ngModel.$untouched) {
                ngModel.$setTouched();
                _this.timeout(function () {
                    scope.$apply();
                });
            }
        };
        this.timeout = timeout;
        this.http = http;
        httpOb = http;
    }
    
    Service.prototype.generateSelect2Box = function (element, params, scope, ngModel, path) {
        
    };
    
   Service.prototype.generateDynatree = function (element, scope, ngModel, path) {
        
        this.http.get(path).success(function (data, status, headers) {
         
            scope.treeData = {'title':'Category tree','expand': true, 'type':'root'};

            var children = [];

            for(i in data){
                var entry = {'id':data[i].pk,'title':data[i].fields.name,'isLazy':true,'type':'category'}

                children.push(entry);
            }

            scope.treeData['children'] = children;

            
            $('#textBlockArea').hide();
            $('#slectedPathArea').hide();
            
            var isMac = /Mac/.test(navigator.platform);
            
            $(element).dynatree({
                  checkbox: true,
                  selectMode: 1,
                  children: scope.treeData,
                  onSelect: function(select, node) {
                     // Display list of selected nodes
                    var selNodes = node.tree.getSelectedNodes();
                   // alert(node.tree.getSelectedNodes().join(", "));
                    // convert to title/key array
                    var selKeys = $.map(selNodes, function(node){
                         return "[" + node.data.key + "]: '" + node.data.title + "'";
                    });
                    
                    selectedNode = node;

                    if(node.data.type == 'subcategory')
                    {
                      httpOb.get('/getcontentbycategoryid',
                            {
                              params:{
                                'categoryId': node.data.id,mode: "funnyMode"
                              }

                            }).success(function (data, status, headers) {
                               alert(data[0].fields.title);
                               scope.contentEditor = data[0].fields.content;
                               scope.contentTitle = data[0].fields.title;
                               selectedContentId = data[0].pk;

                            }).error(function (data, status, headers) {
                                
                            })
                      }
              
                  },
                  
                  onClick: function(node, event) {
                    
                  },
                  onDblClick: function(node, event) {
                      
                      return false;
                  },
                  onKeydown: function(node, event) {
                  
                  },
                  onLazyRead: function(node){
                    var n = node;
                    /*node.appendAjax({
                            url: "/getsubcategory",
                            data: {'categoryId': node.data.id,mode: "funnyMode"}
                    });*/
                      if(node.data.type == 'category'){
                         httpOb.get('/getsubcategory',
                          {
                            params:{
                              'categoryId': node.data.id,mode: "funnyMode"
                            }

                          }).success(function (data, status, headers) {
                            if(data.length > 0){
                              for(i in data){
                                  var entry = {'id':data[i].pk,'title':data[i].fields.name,'isLazy':true,'type':'subcategory'}
                                  node.addChild(entry);
                                }
                            }
                            else{
                               node.setLazyNodeStatus(DTNodeStatus_Ok);
                            }

                          }).error(function (data, status, headers) {
                              node.setLazyNodeStatus(DTNodeStatus_Error);
                          })
                      }
                      else{
                        node.setLazyNodeStatus(DTNodeStatus_Ok);
                      }
                  },
                  strings: {
                    loading: "Loading…",
                    loadError: "Load error!"
                  }

                });
            
            //var dtree = $(element).dynatree("getTree").toDict();
                 
        }).error(function (data, status, headers) {
                  
        })
    };
    
    Service.prototype.addNewCategory = function (newNodeTitle) {
        
        if(newNodeTitle == null || typeof newNodeTitle == 'undefined' || newNodeTitle == ''){
            alert('Please, enter node title.')
        }
        else if(selectedNode == null || typeof selectedNode == 'undefined'){
            alert('Please, select parent node.')
        }
        else{
            //selectedNode.data.hideCheckbox=true
            selectedNode.bExpanded = true;
            var childNode = selectedNode.addChild({
                title: newNodeTitle,
                tooltip: newNodeTitle
              });
            
            childNode.data.select = true;
            childNode.data.focus = true;

            var type='category';
            var id = -1;
            if(selectedNode.data.type == 'category'){
                type = 'subcategory';
                id = selectedNode.data.id;
            }

            

          /*httpOb.post(localUrl+'rest/rationale/template-tree/savechange',
                {headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
              data:$.param({
                'category' : category
              })
            }).success(function (data, status, headers) {
                
            }).error(function (data, status, headers) {
                  
            })*/

            var url = newNodeTitle.toLowerCase();
            url = url.replace(/ /g, "");

            httpOb({
                  method : "POST",
                  url : "/addcategory/",
                  headers: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  data:$.param({
                    'category' : newNodeTitle,
                    'type':type,
                    'parentId':id,
                    'url':url
                  })
              }).then(function mySucces(response) {
                  alert(response.data);
              }, function myError(response) {
                  
              });
        }
 
    };

    Service.prototype.addContentOnCategory = function (contentTitle, content) {
        
        if(contentTitle == null || typeof contentTitle == 'undefined' || contentTitle == ''){
            alert('Please, enter content title.')
        }
        else if(content == null || typeof content == 'undefined' || content == ''){
            alert('Please, enter content.')
        }
        else if(selectedNode == null || typeof selectedNode == 'undefined'){
            alert('Please, select content category.')
        }
        else if(selectedNode.data.type == 'subcategory'){
                //selectedNode.data.hideCheckbox=true
                selectedNode.bExpanded = true;
                var childNode = selectedNode.addChild({
                  title: contentTitle,
                  tooltip: contentTitle
                });
            
                childNode.data.select = true;
                childNode.data.focus = true;

                var type = 'subcategory';
                var categoryId = selectedNode.data.id;

                var url = contentTitle.replace(/ /g, "").replace(/./g, "");

                httpOb({
                  method : "POST",
                  url : "/addcontent/",
                  headers: {
                      'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  data:$.param({
                    'title' : contentTitle,
                    'content' : content,
                    'categoryId':categoryId,
                    'id':selectedContentId,
                    'type':type,
                    'url':url
                  })
              }).then(function mySucces(response) {
                  alert(response.data);
              }, function myError(response) {
                  
              });
          }
    };
    
    Service.prototype.initChangePath = function (value) {
        changePath = value;
    }
    
    getSelectedPath = function(element, keyPath){
        if(element != null && typeof element != 'undefined' && keyPath != null && typeof keyPath != 'undefined'){
            var titlePathArr = [];
            var keyPathArr = keyPath.split('/');
            
            for(keyindex in keyPathArr){
                
                var node =$(element).dynatree("getTree").getNodeByKey(keyPathArr[keyindex]);
                
                if(node != null){
                    titlePathArr.push(node.data.title);
                }
            }
            
            if(titlePathArr.length >0){
                return titlePathArr.join('\\');
            }
            else{
                return null;
            }
        }
        
        return null;
    }
    
    editNode = function(node, element){
            
          var prevTitle = node.data.title,
            tree = node.tree;
          // Disable dynatree mouse- and key handling
          tree.$widget.unbind();
          // Replace node with <input>
          $(".dynatree-title", node.span).html("<input id='editNode' value='" + prevTitle + "'>");
          // Focus <input> and bind keyboard handler
          $("input#editNode")
            .focus()
            .keydown(function(event){
              switch( event.which ) {
              case 27: // [esc]
                // discard changes on [esc]
                $("input#editNode").val(prevTitle);
                $(this).blur();
                break;
              case 13: // [enter]
                // simulate blur to accept new value
                $(this).blur();
                break;
              }
            }).blur(function(event){
              // Accept new value, when user leaves <input>
              var title = $("input#editNode").val();
              
              if(title !=null && typeof title != 'undefined' && title !=''){
                  node.setTitle(title);
                  // Re-enable mouse and keyboard handlling
                  tree.$widget.bind();
                  node.focus();
                  DynaTreeService.prototype.saveChangedNode(prevTitle, title, node.data.key);
                  
                  //var previousPath1 = previousPath;
                  
                  var changePath = getSelectedPath(element, node.getKeyPath());
                  
                  if(changePath != previousPath){
                      DynaTreeService.prototype.updatePath(changePath, previousPath);
                  }
              }
              else{
                  alert("Node cannot be updated. Please, enter node title");
              }
              
            });
        };
        
    
    
    return Service;
})();
