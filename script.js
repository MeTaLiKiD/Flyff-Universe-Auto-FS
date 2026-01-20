// ==UserScript==
// @name         Flyff Universe Auto FS
// @namespace    https://github.com/MeTaLiKiD/Flyff-Universe-Auto-FS
// @version      1.0.0
// @description  Auto FS script for Flyff Universe
// @author       MeTaLiKiD
// @match        https://universe.flyff.com/*
// @icon         https://universe.flyff.com/storage/img/favicon.png
// @grant        none
// ==/UserScript==

(function () {

    // Settings
    const keyToPress = "&";
    const intervalTime = 3000;
    let autoFsInterval = null;

    // Notification function
    const showNotify = (text, color) => {
        let notify = document.getElementById('flyff-auto-fs-notify');
        if (!notify) {
            notify = document.createElement('div');
            notify.id = 'flyff-auto-fs-notify';
            Object.assign(notify.style, {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                padding: '15px 30px',
                borderRadius: '8px',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                fontFamily: 'sans-serif',
                zIndex: '9999',
                pointerEvents: 'none',
                transition: 'opacity 0.4s ease',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            });
            document.body.appendChild(notify);
        }
        notify.innerText = text;
        notify.style.backgroundColor = color;
        notify.style.opacity = '1';

        setTimeout(() => { notify.style.opacity = '0'; }, 3000);
    };

    showNotify("Flyff Universe Auto FS. [TAB] to START/STOP");

    // Key press simulation function
    const pressKey = () => {
        const target = document.querySelector('canvas') || window;
        const opts = {
            key: keyToPress,
            code: "Digit1",
            keyCode: 49,
            which: 49,
            bubbles: true,
            cancelable: true,
            view: window
        };

        target.dispatchEvent(new KeyboardEvent("keydown", opts));
        setTimeout(() => {
            target.dispatchEvent(new KeyboardEvent("keyup", opts));
        }, 50);
    };

    // Start and stop controls
    window.addEventListener("keydown", (event) => {

        // Start and stop with Tab
        if (event.key === "Tab") {
            event.preventDefault();
            if (!autoFsInterval) {
                autoFsInterval = setInterval(pressKey, intervalTime);
                showNotify("Flyff Universe Auto FS started. [TAB] to STOP");
            } else {
                clearInterval(autoFsInterval);
                autoFsInterval = null;
                showNotify("Flyff Universe Auto FS stopped. [TAB] to START");
            }
        }

    });

})();
