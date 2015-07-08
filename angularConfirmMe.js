!(function(window, angular) {
    angular.module('angularConfirmMe', [])
        .factory('ConfirmMe', ["$rootScope", "$timeout", function($rootScope, $timeout) {
            var confirmations = [];

            function mergeObj(obj1, obj2) {
                for (var p in obj2) {
                    try {
                        // Property in destination object set; update its value.
                        if (obj2[p].constructor == Object) {
                            obj1[p] = mergeObj(obj1[p], obj2[p]);
                        } else {
                            obj1[p] = obj2[p];
                        }
                    } catch (e) {
                        // Property in destination object not set; create it and set its value.
                        obj1[p] = obj2[p];
                    }
                }
                return obj1;
            }

            function grep(items, callback, extCallback) {
                if (callback == null) callback = function() {
                    return true
                };
                var filtered = [],
                    len = items.length,
                    i = 0;
                for (i; i < len; i++) {
                    var item = items[i];
                    var cond = callback(item, i);
                    if (cond) {
                        filtered.push(item);
                        if (typeof extCallback == "function") extCallback(item, i);
                    }
                }
                return filtered;
            }

            function fixObject(obj) {
                var newObj = {},
                    settings = {
                        message: "Are you sure you want to do this?",
                        onConfirm: function(button) {},
                        onCancel: function(button) {},
                        onClose: function(button) {}
                    };
                if (typeof obj.message !== "undefined") {
                    var message = settings.message;
                    try {

                        message = obj.message.trim();
                    } catch (e) {

                        throw new ReferenceError("ConfirmMe invalid type for feild: Message which should be String");
                    } finally {
                        if (message == "") throw new ReferenceError("Notifyme empty required feild: Message(String)");
                    }
                }
                newObj.id = Math.floor(Math.random() * 999999999);
                newObj = mergeObj(settings, mergeObj(newObj, obj));
                return newObj;
            };

            function getSettings(id) {
                var obj = grep(confirmations, function(item, index) {
                    return item.id === parseInt(id);
                });
                return (obj.length > 0) ? obj[0] : [];
            }

            function getElement(id) {
                return angular.element(document.querySelector("#confirme-" + id));
            };

            var closeProcess = true;

            function closeConfirmMe(id) {
                // console.log("inside close");
                if (closeProcess === true) {
                    closeProcess = false;
                    grep(confirmations, function(item, index) {
                        return item.id === parseInt(id);
                    }, function(item, i) {
                        // console.log("inside grep");
                        getElement(id).removeClass("is-visible")
                        $timeout(function() {
                            confirmations.splice(i, 1);
                            $rootScope.$broadcast("confirmations:updated");
                            closeProcess = true;
                            item.onClose();
                        }, 300);
                    });
                }
            }

            return {
                getConfirmations: function() {
                    return confirmations;
                },
                confirm: function(object) {
                    object = ((typeof object == "undefined") ? {} : object);
                    var obj = fixObject(object);
                    confirmations.push(obj);
                    $rootScope.$broadcast("confirmations:updated");
                    $timeout(function() {
                        getElement(obj.id).addClass("is-visible");
                    }, 50);
                },
                cancel: function(id) {
                    getSettings(id).onCancel();
                    closeConfirmMe(id);
                },
                confirmed: function(id) {
                    getSettings(id).onConfirm();
                    closeConfirmMe(id);
                },
                close: function(id) {
                    closeConfirmMe.apply(this, arguments);
                }
            };
        }])
        .controller('ConfirmMeController', ["$scope", "ConfirmMe", function($scope, ConfirmMe) {
            $scope.confirmations = ConfirmMe.getConfirmations();
            $scope.close = ConfirmMe.close;
            $scope.confirm = ConfirmMe.confirmed;
            $scope.cancel = ConfirmMe.cancel;

            $scope.$on('confirmations:updated', function(event) {
                $scope.confirmations = ConfirmMe.getConfirmations();
                //console.log($scope.confirmations);
            });
        }])
        .directive('confirmme', ["ConfirmMe", function(ConfirmMe) {
            return {
                restrict: 'AE',
                replace: true,
                template: "<div id='confirmMe-wrapper'>\
                        <div ng-controller='ConfirmMeController'>\
                            <div ng-repeat='conf in confirmations' id='confirme-{{ conf.id }}' class='confirme-popup' role='alert'>\
                                <div class='confirme-popup-container'>\
                                    <p>{{ conf.message }}</p>\
                                    <ul class='confirme-buttons list-inline m-n p-b p-l p-r'>\
                                        <li><a class='btn btn-md rounded w-xs pull-right confirme-popup-confirm' ng-click='confirm(conf.id)'>Yes</a></li>\
                                        <li><a class='btn btn-md rounded w-xs pull-left confirme-popup-cancel' ng-click='cancel(conf.id)'>No</a></li>\
                                    </ul>\
                                    <a class='confirme-popup-close' ng-click='close(conf.id)'></a>\
                                </div>\
                            </div>\
                        </div>\
                    </div>",
                link: function(scope) {
                    console.log("working")
                    angular.element(document).on('keydown', function(e) {
                        var elements = document.querySelectorAll(".confirme-popup.is-visible");
                        if (elements.length > 0) {
                            var id = elements[elements.length - 1].getAttribute("id").split("-")[1];
                            ConfirmMe.close(id);
                        }
                    });
                }
            }
        }]);
})(window, window.angular);
