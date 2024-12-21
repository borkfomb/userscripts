// ==UserScript==
// @name         Twitch X/YouTube Link Opener
// @namespace    null
// @version      4
// @description  Open partial X/YouTube Links when copied from Twitch chat. Users post partial links to cirCUMvent the chat filter.
// @author       nc
// @match        https://www.twitch.tv/*
// @match        https://www.twitch.tv/popout/*/chat
// @exclude     /^https://(clips|dashboard|www)\.twitch\.tv/(directory|settings|subs|subscriptions|videos|user|payments|wallet)/*/
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @downloadURL  https://github.com/borkfomb/userscripts/raw/main/Twitch-X-YouTube-Link-Opener.user.js
// @updateURL    https://github.com/borkfomb/userscripts/raw/main/Twitch-X-YouTube-Link-Opener.user.js
// ==/UserScript==
//
// This method is less convenient than link replacement but ensures zero overhead, and user interaction (for safety). sugoiTea
// Tested with Violentmonkey.
// v1:
// v2: Fix regex, Add clipboard clearing, Add exclusions.
// v3: Fix what I broke.
// v4: Workaround Twitch inserting newlines after '?'.

(function() {
    'use strict';
    // listen for copy events
    document.addEventListener('copy', function(event) {
        setTimeout(function() {
            // browser requests clipboard permission
            // this grants Twitch access to clipboard data
            navigator.clipboard.readText().then(text => {
                let url = null;
                // check for X
                if (text.trim().match(/^([_a-zA-Z0-9]+)\/status\/(\d+)$/i)) {
                    url = `https://x.com/${text}`;
                }
                // check for YouTube
                else if (text.replace(/^\s+|\s+$/g, '').match(/^watch\?v=([\w-]+)$/i)) {
                    url = `https://www.youtube.com/${text}`;
                }
                // open the url in a new tab
                if (url) {
                    GM_openInTab(url, false);
                    // clear clipboard on success
                    navigator.clipboard.writeText('').then(function() {
                        console.log('Clipboard cleared successfully');
                    }, function(err) {
                        console.error('Failed to clear clipboard: ', err);
                    });
                }
            }).catch(err => {
                console.error('Failed to read clipboard: ', err);
            });
        }, 100); // delay to ensure clipboard is updated
    });
})();
