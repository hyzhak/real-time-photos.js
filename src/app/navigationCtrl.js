define([
    'app/appModule',
    'app/core',
    'app/aboutController',
    'app/startController',
    'app/workspace'
],function (appModule, Core, AboutController, StartContoller, Workspace) {
    appModule.controller('NavigationCtrl', ['$scope', '$rootScope', '$route', '$location', function ($scope, $rootScope, $route, $location)  {

        //event had removed after 1.0.0
        //$rootScope.$on('$beforeRouteChange', function(scope, newRoute){
        $rootScope.$on('$routeChangeStart', function(scope, newRoute){
            if (!newRoute || !newRoute.$route) return;

            _gaq.push(['_trackPageview']);
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

            //update tags
            //setTags(Workspace.tags);
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
                if(Workspace.defaultUrl){
                    //$location.url('/#/tag/' + Workspace.tagCollection);
                    window.location = Workspace.defaultUrl;
                }
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

        $scope.tagsText = '#love #valentin #kiss';

        $scope.requestCustomTag = function(){
            var tags = parseTagsFromText($scope.tagsText);
            //window.location = window.location.origin + window.location.pathname + '#/tag/' + tags.join('+');
            window.location = '#/tag/' + tags.join('+');
        }

        function parseTagsFromText(tagsText) {
            //var regexp = /(?<!["'=])#[0-Z_]+\b/;
            //var regexp = new RegExp('(?<!["\'=])#[0-Z_]+\b');
            //var regexp = /(?<!["'=])#[0-Z_]+\b/gi;
            //var regexp = /\S*#(?:\[[^\]]+\]|\S+)/gi;

            //TODO : find hashtags and collect them without '#'
            var result = tagsText.match(/(#[A-Za-z0-9\-\_]+)/g) || [];
            for(var index = result.length - 1; index >= 0; index--){
                result[index] = result[index].replace('#', '');
            }

            return result;
            //var regexp = /(\S*#\[[^\]]+\])|(\S*#\S+)/gi;
            //return regexp.exec(tagsText);
        }

        function setTags(tags){
            if($scope.tags == tags){
                return;
            }

            $scope.$apply(function(){
                $scope.tags == tags;
            });
        }

        $scope.tags = [];
        $scope.$watch('tags', function(newValue){
            $scope.tagsText = newValue.join(',');
        });

        $scope.getPlayButtonIcon = function(){
            return Core.running?'icon-pause':'icon-play-circle';
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
            if(Core.running){
                Core.stop();
                $location.url('/');
                //_gaq.push(['_trackPageview', '/#/']);
            }else{
                Core.start();
                //_gaq.push(['_trackPageview', '/#/play/tag/' + $scope.tag]);
            }

            //setPlaying(!$scope.playing);
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