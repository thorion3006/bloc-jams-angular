(function() {
    function CollectionCtrl(Fixtures, SongPlayer) {
        this.albums = Fixtures.getCollection(12);
        this.songPlayer = SongPlayer;
    }
    
    angular
        .module('blocJams')
        .controller('CollectionCtrl', ['Fixtures', 'SongPlayer', CollectionCtrl]);
})();