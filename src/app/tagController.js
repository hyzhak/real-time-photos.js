define([
    'app/core',
    'app/workspace'
],function (Core, Workspace) {
    var TagController = function($scope, $routeParams, $location){
        console.log('TagController');
        var tags = $routeParams.tags;

        var tagsArray = tags.split('+');

        Core.startFollowByTags(tagsArray);

        Workspace.defaultUrl = $location.absUrl();

        document.title = 'Real-time photos on map with love / #' + tagsArray.join(' #');
        console.log(document.title)
    }

    return TagController;
});