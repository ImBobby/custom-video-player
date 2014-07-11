var Pluit = (function () {

    var video           = document.querySelector('video')
      , videoWrapper    = document.querySelector('.video-container')

      , videoCtrl       = document.querySelectorAll('[data-video-control]')
      , videoVolumeCtrl = document.querySelector('[data-video="volume"]')
      , videoSeekCtrl   = document.querySelector('[data-video-seek]')

      , videoDuration   = document.querySelector('#videoDuration')
      , videoDurationM  = document.querySelector('#videoDurationMin')
      , videoDurationS  = document.querySelector('#videoDurationSec')
      ;

    var vidAction = {
        play: 'play'
      , pause: 'pause'
      , mute: 'mute'
      , unmute: 'unmute'
      , fullscreen: 'fullscreen'
      , exitFullscreen: 'exitfullscreen'
    };


    /* Helper function
    --------------------------------------------------------------------------- */

    var setVideoCtrlState = function (elem, state) {
        var icon = elem.querySelector('.icon');

        if ( state === vidAction.play ) {

            icon.classList.remove('icon-pause');
            icon.classList.add('icon-play2');

        } else if ( state === vidAction.pause ) {

            icon.classList.remove('icon-play2');
            icon.classList.add('icon-pause');

        } else if ( state === vidAction.mute ) {

            icon.classList.remove('icon-volume-mute2');
            icon.classList.add('icon-volume-high');

        } else if ( state === vidAction.unmute ) {

            icon.classList.remove('icon-volume-high');
            icon.classList.add('icon-volume-mute2');

        } else if ( state === vidAction.fullscreen ) {

            icon.classList.remove('icon-contract');
            icon.classList.add('icon-expand');

        } else if ( state === vidAction.exitFullscreen ) {

            icon.classList.remove('icon-expand');
            icon.classList.add('icon-contract');

        }

        elem.setAttribute('data-video-control', state);
    };

    var setFullscreen = function (elem) {
        if ( elem.requestFullscreen ) {
            elem.requestFullscreen();
        } else if ( elem.msRequestFullscreen ) {
            elem.msRequestFullscreen();
        } else if ( elem.mozRequestFullScreen ) {
            elem.mozRequestFullScreen();
        } else if ( elem.webkitRequestFullscreen ) {
            elem.webkitRequestFullscreen();
        }
    };

    var noFullscreen = function () {
        if ( document.exitFullscreen ) {
            document.exitFullscreen();
        } else if ( document.msExitFullscreen ) {
            document.msExitFullscreen();
        } else if ( document.mozCancelFullScreen ) {
            document.mozCancelFullScreen();
        } else if ( document.webkitExitFullscreen ) {
            document.webkitExitFullscreen();
        }
    }


    /* Event: video control
    --------------------------------------------------------------------------- */

    var setVideoControl = function () {
        var action = this.getAttribute('data-video-control');

        switch (action) {
            case vidAction.play:
                video.play();
                setVideoCtrlState(this, vidAction.pause);

                break;

            case vidAction.pause:
                video.pause();
                setVideoCtrlState(this, vidAction.play);

                break;

            case vidAction.mute:
                video.muted = true;
                setVideoCtrlState(this, vidAction.unmute);

                break;

            case vidAction.unmute:
                video.muted = false;
                setVideoCtrlState(this, vidAction.mute);

                break;

            case vidAction.fullscreen:
                setFullscreen(videoWrapper);
                setVideoCtrlState(this, vidAction.exitFullscreen);

                break;

            case vidAction.exitFullscreen:
                noFullscreen();
                setVideoCtrlState(this, vidAction.fullscreen);

                break;
        }
    };

    var setVolumeVideo = function () {
        var val = this.value;

        video.volume = val;
    };

    var setVideoSeekTime = function () {
        var _time = this.value;

        video.currentTime = _time;
    };


    /* Event: video
    --------------------------------------------------------------------------- */

    var getVidInfo = function () {
        var _duration       = parseInt(video.duration)
          , vidDurationMin  = parseInt(_duration/60)
          , vidDurationSec  = Math.floor(_duration%60)
          ;

        videoDuration.textContent = vidDurationMin + ':' + vidDurationSec;
        videoSeekCtrl.setAttribute('max', _duration);
    };

    var setVideoCtrlStart = function () {
        var _playBtn        = document.querySelector('[data-video-control="play"]')
          , _pauseBtn       = document.querySelector('[data-video-control="pause"]')
          , videoCtrlPlay   = _playBtn || _pauseBtn
          ;

        setVideoCtrlState(videoCtrlPlay, 'play');
    };

    var setVideoRealtime = function () {
        var curr = parseInt( this.currentTime );
        videoDurationM.textContent = '0';

        if ( curr < 60 ) {

            if ( curr < 10 ) {
                videoDurationS.textContent = '0' + curr;
            } else {
                videoDurationS.textContent = curr;
            }

        } else {

            var _min = parseInt(curr/60)
              , _sec = Math.floor(curr%60)
              ;

            videoDurationM.textContent = _min;

            if ( _sec < 10 ) {
                videoDurationS.textContent = '0' + _sec;
            } else {
                videoDurationS.textContent = _sec;
            }

        }

        videoSeekCtrl.value = curr;
    };

    var setVideoPlayback = function () {
        var _playBtn = document.querySelector('[data-video-control="play"]')
          , _pauseBtn = document.querySelector('[data-video-control="pause"]')
          , _videoCtrl = _playBtn || _pauseBtn
          ;

        if ( !this.paused ) {
            this.pause();

            setVideoCtrlState(_videoCtrl, 'play');
        } else {
            this.play();

            setVideoCtrlState(_videoCtrl, 'pause');
        }
    };


    /* Event listener
    --------------------------------------------------------------------------- */

    video.addEventListener('loadedmetadata', getVidInfo, false);
    video.addEventListener('ended', setVideoCtrlStart, false);
    video.addEventListener('timeupdate', setVideoRealtime, false);
    video.addEventListener('click', setVideoPlayback, false);

    for (var i = videoCtrl.length - 1; i >= 0; i--) {
        videoCtrl[i].addEventListener('click', setVideoControl, false);
    }

    videoVolumeCtrl.addEventListener('input', setVolumeVideo, false);
    videoVolumeCtrl.addEventListener('change', setVolumeVideo, false);
    videoSeekCtrl.addEventListener('input', setVideoSeekTime, false);
    videoSeekCtrl.addEventListener('change', setVideoSeekTime, false);

})();