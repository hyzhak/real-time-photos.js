define([
    'app/appModule',
    'app/core',
    'app/aboutController',
    'app/startController'
],function (appModule, Core, AboutController, StartContoller) {
    appModule.controller('NavigationCtrl', ['$scope', '$rootScope', '$route', function ($scope, $rootScope, $route)  {

        //event had removed after 1.0.0
        //$rootScope.$on('$beforeRouteChange', function(scope, newRoute){
        $rootScope.$on('$routeChangeStart', function(scope, newRoute){
            console.log('$routeChangeStart', scope, newRoute);
            if (!newRoute || !newRoute.$route) return;
            //Load any required resources here
            //Set the state bound do the ng-include src attribute

            if(!$rootScope.templates){
                $rootScope.templates = {};
            }

            var newTemplates = newRoute.$route.templates;
            if(!newTemplates){
                newTemplates = {};
            }
            //switch modal;
            //hide old one,
            if($rootScope.templates.modalWindowUrl){
                hideModalWindow(function(){
                    showModalWindow(newTemplates.modalWindowUrl);
                });
            }else{
                showModalWindow(newTemplates.modalWindowUrl);
            }

            for(var key in newTemplates){
                if(key != 'modalWindowUrl'){
                    $rootScope.templates = newTemplates[key];
                }
            }
        });

        function hideModalWindow(handler) {
            $('#modal-window').modal('hide');
            $('#modal-window').on('hidden', handler);
        }

        function showModalWindow(modalWindowUrl) {
            if(!modalWindowUrl){
                return;
            }
            $rootScope.templates.modalWindowUrl = modalWindowUrl;
            $('#modal-window').modal('show').on('hidden', function(){
                $rootScope.templates.modalWindowUrl = null;

                //TODO : if user press outside the modal window we need to run default action:
                //* for start page it's default tag
                //  * it shall run images with default tag;
                //  * or continue if we already execute a process;
                //* for about button we need just return to continue execute process
            });
        }

        var heatMap = false;

        setPlaying(false);

        function setPlaying(value, tag){
            $scope.playing = value;
            if(value){
                $scope.tag = tag||$scope.tag;
                Core.startFollowByTag($scope.tag);
            }else{
                Core.stop();
            }
        }

        $scope.tag = 'Christmas';

        $scope.getPlayButtonIcon = function(){
            return $scope.playing?'icon-pause':'icon-play-circle';
        }

        $scope.isStopActive = function(){
            return !$scope.playing?'active':'';
        }

        $scope.isPlayActive = function(){
            return $scope.playing?'active':'';
        }

        $scope.isStopped = function(){
            return !$scope.playing;
        }

        $scope.stop = function(){
            setPlaying(true);
        }

        $scope.requestByTag = function(){
            setPlaying(false);
        }

        $scope.togglePlay = function(){
            if($scope.playing){
                _gaq.push(['_trackPageview', '/#/stop']);
            }else{
                _gaq.push(['_trackPageview', '/#/play/tag/' + $scope.tag]);
            }

            setPlaying(!$scope.playing);
        }

        $scope.startPlayMainButton = function(){
            _gaq.push(['_trackPageview', '/#/playMainButton/tag/' + $scope.tag]);
            setPlaying(true);
        }

        $scope.toggleHeatmap = function(){
            heatMap = !heatMap;
            Core.setVisibleHeatMap(heatMap);
            Core.setVisibleImages(!heatMap);
        }

        $scope.playChristmas = function(){
            setPlaying(true, 'christmas');
        }

        $scope.clearAllImages = function(){
            Core.clearAllImages();
        }
    }]);
});