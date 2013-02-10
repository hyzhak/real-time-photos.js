define([
    'app/appModule'
],function (module) {
    return module.controller('AboutController', ['$scope', function(){
        $('#modal-window').modal()
            .on('hidden', function(e){
                window.location = '/#/';
            });
        }]);
});