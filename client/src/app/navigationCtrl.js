define([
    'app/appModule',
    'app/core'
],function (appModule, Core) {
    appModule.controller('NavigationCtrl', function($scope) {

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
    });
});