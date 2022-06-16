//Driver code

import { CarController } from './CarController.js';
import { GameLoop } from './GameLoop.js';

(function ($) {
    $(function() {
        let debugLogs = false;
        let gameLoop = new GameLoop(onRun, onStart, onStop, onPause, onResume, 60);
        let car = $('#car');

        let roadLengthMeters = 300;
        let carSpeedMeters = 15; // meters/second

        let screenWidth = document.documentElement.clientWidth;
        let pixelsPerMeter = (screenWidth / roadLengthMeters);
        let carSpeedPixels = (carSpeedMeters * pixelsPerMeter); // pixels/second
        let documentHasFocus = true;
        let userPaused = false;

        let rightKeyActive = false;
        let leftKeyActive = false;

        gameLoop.logger = (type, message) => {
            logType(type, message);
        };

        gameLoop.initialize(() => {
            $(window).on('keydown', function (event) {
                if (event.key == "Right" || event.key == "ArrowRight") { // space
                    event.preventDefault();

                    if (gameLoop.loopState === GameLoop.LoopState.STOPPED) {
                        gameLoop.start();
                    }
                    else if (gameLoop.loopState === GameLoop.LoopState.PAUSED) {
                        userPaused = false;
                        gameLoop.resume();
                    }
                    else if (gameLoop.loopState === GameLoop.LoopState.RUNNING) {
                        userPaused = true;
                        pause();
                    }
                    rightKeyActive = true;
                }
                if (event.key == "Left" || event.key == "ArrowLeft") { // space
                    event.preventDefault();

                    if (gameLoop.loopState === GameLoop.LoopState.STOPPED) {
                        gameLoop.start();
                    }
                    else if (gameLoop.loopState === GameLoop.LoopState.PAUSED) {
                        userPaused = false;
                        gameLoop.resume();
                    }
                    else if (gameLoop.loopState === GameLoop.LoopState.RUNNING) {
                        userPaused = true;
                        pause();
                    }
                    leftKeyActive = true;
                }
            });
            $(window).on('keyup', function (event) {
                if (event.key == "Right" || event.key == "ArrowRight") { // space
                    event.preventDefault();

                    rightKeyActive = false;
                }
                if (event.key == "Left" || event.key == "ArrowLeft") { // space
                    event.preventDefault();

                    leftKeyActive = false;
                }
            });
        });

        function pause() {
           /* gameLoop.pause(() => {
                if (!userPaused && document.hasFocus()) {
                    documentHasFocus = true;
                    gameLoop.resume();
                }
            }, 600);*/
        }

        function onRun (delayMilli, delaySeconds) {
           /* if (!document.hasFocus()) {
                if (documentHasFocus) {
                    pause();
                }

                documentHasFocus = false;
                return;
            }
*/
            let moveDistance = (carSpeedPixels * delaySeconds);
            let left = car.position().left;
            if (leftKeyActive) {
                left -= moveDistance;
            }
            else if (rightKeyActive) {
                left += moveDistance;
            }

            log(GameLoop.LogType.DEBUG, 'moving car', moveDistance + ' pixels to ' + left);

            console.log("Left: " + left);

            if (left < screenWidth && left > 0) {
                car.css('left', left);
            }
            else {
                //gameLoop.stop();
            }
        }

        function onStart () {
            log(GameLoop.LogType.INFO, 'Loop State', 'Started');

            log(GameLoop.LogType.INFO, 'roadLengthMeters', roadLengthMeters);
            log(GameLoop.LogType.INFO, 'carSpeedMeters', carSpeedMeters);
            log(GameLoop.LogType.INFO, 'screenWidth', screenWidth);
            log(GameLoop.LogType.INFO, 'pixelsPerMeter', pixelsPerMeter);
            log(GameLoop.LogType.INFO, 'carSpeedPixels', carSpeedPixels);
            log(GameLoop.LogType.INFO, 'realWorldTime', (roadLengthMeters / carSpeedMeters) + ' seconds');
        }

        function onStop () {
            if (gameLoop.loopState !== GameLoop.LoopState.STOPPED)
                return;

            log(GameLoop.LogType.INFO, 'Loop State', 'Stopped');
        }

        function onPause () {
            //if (gameLoop.loopState !== GameLoop.LoopState.PAUSED)
            //    return;

            log(GameLoop.LogType.INFO, 'Loop State', 'Paused');
        }

        function onResume () {
            log(GameLoop.LogType.INFO, 'Loop State', 'Resumed');
        }

        function log(type, title, message) {
            logType(type, title + ': ' + message);
        }

        function logType(type, message) {
            if (!debugLogs && type === GameLoop.LogType.DEBUG)
                return;

            console.log(type.description + ' - ' + message);
        }
    });
})(jQuery);
