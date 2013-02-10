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
    }

    return TagController;
});