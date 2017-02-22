(function() {
    function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};
        
        /**
        * @desc Stores the Currently playing album
        * @type {Object}
        */
        var currentAlbum = Fixtures.getAlbum();
        
        /**
        * @desc Buzz object audio file
        * @type {Object}
        */
        var currentBuzzObject = null;
        
        /**
        * @function setSong
        * @desc Stops currently playing song and loads new audio file as currentBuzzObject
        * @param {Object} song
        */
        var setSong = function(song) {
            if (currentBuzzObject) {
                stopSong();
            }
 
            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
            
            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                });
            });
            
            SongPlayer.currentSong = song;
        };
        
        /**
        * @function playSong
        * @desc Plays the song
        * @param {Object} song
        */
        var playSong = function(song) {
            currentBuzzObject.play();
            song.playing = true;
        };
        
        /**
        * @desc Returns the index of currently playing song
        * @type {object}
        * @return {number}
        */
        var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
        };
        
        /**
        * @function stopSong
        * @desc Stops current buzz object and sets playing property to null
        */
        var stopSong = function() {
            currentBuzzObject.stop();
            SongPlayer.currentSong.playing = null;
        };
        
        /**
        * @function isMuted
        * @desc checks if song is muted
        * @return {boolean}
        */
        var isMuted = function() {
            if(currentBuzzObject) {
                return currentBuzzObject.isMuted();
            }
        };
        
        /**
        * @desc Tracks currently playing song
        * @type {object}
        */
        SongPlayer.currentSong = null;
        
        /**
        * @desc Current playback time (in seconds) of currently playing song
        * @type {Number}
        */
        SongPlayer.currentTime = null;
        
        /**
        * @desc Holds the value of the volume
        * @type {Number}
        */
        SongPlayer.volume = 80;
        
        /**
        * @function setVolume
        * @desc Sets volume of currently playing song
        * @param {Number} volume
        */
        SongPlayer.setVolume = function(volume) {
            if(currentBuzzObject) {
                currentBuzzObject.setVolume(volume);
            } 
        };
        
        /**
        * @function toggleMute
        * @desc Toogles volume between mute and un-mute
        */
        SongPlayer.toggleMute = function() {
            if(currentBuzzObject) {
                currentBuzzObject.toggleMute();
            }
        };
        
        /**
        * @function SongPlayer.status
        * @desc sets volume icon according to its value
        * @return {String} status
        */
        SongPlayer.status = function() {
            var status = "high";
            
            if(isMuted()){
                status = "mute";
            } else if(currentBuzzObject && currentBuzzObject.getVolume() > 65) {
                status = "high";
            } else if(currentBuzzObject && currentBuzzObject.getVolume() < 66 && currentBuzzObject.getVolume() > 33) {
                status = "medium";
            } else {
                status = "low";
            }
            return status;
        };
        
        /**
        * @function SongPlayer.play
        * @desc Checks if SongPlayer.currentSong is intiallized or not and calls setSong and playSong accordingly
        * @param {Object} song
        */
        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);
            } else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    playSong(song);
                }
            }           
        };
        
        /**
        * @function SongPlayer.pause
        * @desc Pauses the currently playing song
        * @param {Object} song
        */
        SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };
        
        /**
        * @function SongPlayer.previous
        * @desc Changes the current song index to its previous one and plays it
        */
        SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;
            
            if (currentSongIndex < 0) {
                stopSong();
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
        
        /**
        * @function SongPlayer.next
        * @desc Changes the current song index to its next one and plays it
        */
        SongPlayer.next = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;
            
            if (currentSongIndex > currentAlbum.songs.length) {
                stopSong();
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
        
        /**
        * @function setCurrentTime
        * @desc Set current time (in seconds) of currently playing song
        * @param {Number} time
        */
        SongPlayer.setCurrentTime = function(time) {
            if(currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
        };
        
        return SongPlayer;
    }
    
    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();