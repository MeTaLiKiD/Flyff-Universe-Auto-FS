// ==UserScript==
// @name         Flyff Universe Auto FS
// @namespace    https://github.com/MeTaLiKiD/Flyff-Universe-Auto-FS
// @version      2.0.0
// @description  Auto FS for Flyff Universe
// @author       MeTaLiKiD
// @match        https://universe.flyff.com/*
// @icon         https://universe.flyff.com/storage/img/favicon.png
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let isRunning = false;
    let intervals = {};

    // --- Styles ---
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes flash-green {
            0% { background-color: #28a745; border-color: #28a745; }
            100% { background-color: #333; border-color: #000; }
        }
        .key-flash { animation: flash-green 0.4s ease-out; }
        .fs-input::-webkit-inner-spin-button, .fs-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    `;
    document.head.appendChild(style);

    // --- Focus ---
    const restoreFocus = () => {
        const gameCanvas = document.querySelector('canvas');
        if (gameCanvas) {
            gameCanvas.focus();
            gameCanvas.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            gameCanvas.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        }
    };

    // --- UI ---
    const container = document.createElement('div');
    Object.assign(container.style, {
        position: 'fixed', top: '20px', right: '20px', width: '180px',
        backgroundColor: '#121212', color: '#eee', borderRadius: '6px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.8)', zIndex: '10000',
        fontFamily: 'Segoe UI, Arial, sans-serif', fontSize: '11px', userSelect: 'none'
    });

    container.innerHTML = `
        <div id="fs-header" style="padding: 6px 10px; background: #1f1f1f; cursor: move; border-radius: 6px 6px 0 0; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333;">
            <span style="font-weight: bold; color: #ccc;">Auto FS</span>
            <button id="fs-hide-btn" style="background: none; border: none; color: #fff; cursor: pointer; font-weight: bold; font-size: 14px;">–</button>
        </div>
        <div id="fs-body">
            <div id="fs-content" style="padding: 8px;">
                <div id="keys-list"></div>
                <button id="fs-main-toggle" style="width: 100%; padding: 6px; margin-top: 6px; border: none; border-radius: 3px; background: #28a745; color: white; font-weight: bold; cursor: pointer;">
                    <span id="fs-icon">▶</span> Lancer
                </button>
            </div>
            <div id="fs-footer" style="padding: 5px; font-size: 9px; text-align: center; border-top: 1px solid #222; color: #bbb;">
                Created by <a href="https://github.com/MeTaLiKiD/Flyff-Universe-Auto-FS" target="_blank" style="color: #bbb;">MeTaLiKiD</a>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    const keysList = container.querySelector('#keys-list');
    for (let i = 1; i <= 9; i++) {
        const row = document.createElement('div');
        row.style.cssText = 'display: flex; align-items: center; margin-bottom: 3px; gap: 5px;';
        row.innerHTML = `
            <input type="checkbox" id="check-${i}" style="margin: 0; cursor: pointer; width: 12px; height: 12px;">
            <div id="key-visual-${i}" style="width: 18px; height: 18px; background: #333; border-radius: 2px; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: bold; border-bottom: 2px solid #000;">${i}</div>
            <div style="display: flex; align-items: center; background: #1a1a1a; border-radius: 2px; border: 1px solid #333; flex-grow: 1;">
                <button class="m" data-id="${i}" style="background: none; border: none; color: #666; cursor: pointer; padding: 0 4px;">-</button>
                <input type="number" id="time-${i}" value="3000" class="fs-input" style="width: 100%; background: none; border: none; color: #fff; text-align: center; font-size: 10px;">
                <button class="p" data-id="${i}" style="background: none; border: none; color: #666; cursor: pointer; padding: 0 4px;">+</button>
            </div>
        `;
        keysList.appendChild(row);
    }

    // --- Simulation Function ---
    const pressKey = (num) => {
        const target = document.querySelector('canvas') || window;
        const keyMap = { 1: '&', 2: 'é', 3: '"', 4: "'", 5: '(', 6: '-', 7: 'è', 8: '_', 9: 'ç' };
        const keyData = {
            key: keyMap[num],
            code: `Digit${num}`,
            keyCode: 48 + num,
            which: 48 + num,
            bubbles: true,
            composed: true,
            cancelable: true
        };

        const el = document.getElementById(`key-visual-${num}`);
        if (el) {
            el.classList.remove('key-flash');
            void el.offsetWidth;
            el.classList.add('key-flash');
        }

        target.dispatchEvent(new KeyboardEvent("keydown", keyData));
        setTimeout(() => {
            target.dispatchEvent(new KeyboardEvent("keyup", keyData));
        }, 50);
    };

    const toggle = () => {
        const btn = document.getElementById('fs-main-toggle');
        if (!isRunning) {
            isRunning = true;
            for (let i = 1; i <= 9; i++) {
                const isChecked = document.getElementById(`check-${i}`).checked;
                const time = parseInt(document.getElementById(`time-${i}`).value);
                if (isChecked && time >= 100) {
                    intervals[i] = setInterval(() => pressKey(i), time);
                }
            }
            btn.style.background = '#dc3545';
            btn.innerHTML = '⏹ Stop';
        } else {
            isRunning = false;
            Object.values(intervals).forEach(clearInterval);
            intervals = {};
            btn.style.background = '#28a745';
            btn.innerHTML = '▶ Run';
        }
        restoreFocus();
    };

    // --- Events & Focus Management ---
    container.addEventListener('click', (e) => {
        if (e.target.id === 'fs-main-toggle' || e.target.closest('#fs-main-toggle')) {
            toggle();
        }

        if (e.target.classList.contains('p') || e.target.classList.contains('m')) {
            const id = e.target.dataset.id;
            const input = document.getElementById(`time-${id}`);
            input.value = Math.max(100, (parseInt(input.value) || 0) + (e.target.classList.contains('p') ? 1000 : -1000));
            restoreFocus();
        }

        if (e.target.type === 'checkbox') {
            restoreFocus();
        }

        if (e.target.id === 'fs-hide-btn') {
            const body = document.getElementById('fs-body');
            const isHidden = body.style.display === 'none';
            body.style.display = isHidden ? 'block' : 'none';
            e.target.innerText = isHidden ? '–' : '▢';
            container.style.width = isHidden ? '180px' : '60px';
            restoreFocus();
        }
    });

    container.querySelectorAll('.fs-input').forEach(input => {
        input.addEventListener('change', restoreFocus);
    });

    // Draggable
    let drag = false, offset = [0, 0];
    container.querySelector('#fs-header').onmousedown = (e) => {
        drag = true;
        offset = [container.offsetLeft - e.clientX, container.offsetTop - e.clientY];
    };
    document.addEventListener('mousemove', (e) => {
        if (drag) {
            container.style.left = (e.clientX + offset[0]) + 'px';
            container.style.top = (e.clientY + offset[1]) + 'px';
            container.style.right = 'auto';
        }
    });
    document.addEventListener('mouseup', () => {
        if (drag) {
            drag = false;
            restoreFocus();
        }
    });

})();
