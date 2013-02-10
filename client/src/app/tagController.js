define([
    'app/core'
],function (Core) {
    var TagController = function($scope, $routeParams){
        console.log('TagController');
        var tags = $routeParams.tags;
        var tagsArray = tags.split('+');
        console.log(tagsArray[0]);
        //$scope.tag = 'love';

        //TODO follow all tags
        Core.startFollowByTag(tagsArray[0]);
        Core.startFollowByTags(tagsArray);
    }

    return TagController;
});