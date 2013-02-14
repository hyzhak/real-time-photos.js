define([
    'app/core',
    'app/workspace'
],function (Core, Workspace) {
    var TagController = function($scope, $routeParams, $location){
        var tags = $routeParams.tags;

        var tagsArray = tags.split('+');

        Core.startFollowByTags(tagsArray);

        Workspace.defaultUrl = $location.absUrl();
        Workspace.tags = tagsArray;

        document.title = 'Real-time photos on map with love / #' + tagsArray.join(' #');
    }

    return TagController;
});