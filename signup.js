// ==UserScript==
// @name         JM天堂
// @namespace    https://18comic.vip/*
// @version      2025-05-16
// @description  try to take over the world!
// @author       You
// @match        *://*
// @match        *://*/*
// @match        *://*/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=18comic.vip
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 定义一个通用的判断函数
    function startClick(id, interval = 1000, delay) {
        const maxAttempts = 100;

        const button = document.querySelector(id);
        console.log(button);
        const popup = document.getElementById("bouns-popup");
        const bonus = document.querySelector(".login-bouns");

        // 确保 button 是一个 DOM 元素
        if (!(button instanceof HTMLElement)) {
            console.error("Invalid button element");
            return;
        }

        // 确保 popup 和 bonus 是有效的 DOM 元素
        if (!popup || !bonus) {
            console.error("Target elements '#bouns-popup' and '.login-bouns' not found");
            return;
        }

        // 如果没有提供 isClickEffective 函数，则默认为永远不生效
        if (typeof isClickEffective !== "function") {
            console.warn("No isClickEffective function provided. Click will continue indefinitely.");
            isClickEffective = () => false;
        }

        // 获取初始状态
        const initialState = {
            display: window.getComputedStyle(popup).display,
            content: bonus.textContent
        };

        // 如果初始状态已经满足条件，则直接返回
        if (initialState.content === "今日已簽到") {
            console.log("Initial state already satisfies the condition. No need to click.");
            return;
        }

        // 判断点击是否生效
        function isClickEffective() {
            // 获取当前状态
            const currentState = {
                display: window.getComputedStyle(popup).display,
                content: bonus.textContent
            };
            
            if (initialState.display != currentState.display) {
                console.log(`page #bouns-popup Display changed from ${initialState.display} to ${currentState.display}`);
                return true;
            }

            if (initialState.content != currentState.content) {
                console.log(`button .login-bouns Content changed from "${initialState.content}" to "${currentState.content}"`);
                return true;
            }
            return false;
        }

        // 循环点击
        let attemptCount = 0;
        function clickButton() {
            attemptCount++;
            console.log(`Attempt ${attemptCount}: Clicking button ${id}...`);
            button.click();

            // 判断点击是否生效
            if (isClickEffective()) {
                console.log(`button ${id} Click is effective. Stopping...`);
                clearInterval(intervalId); // 停止循环
            } else if (attemptCount >= maxAttempts) {
                console.log(`button ${id} Reached maximum attempts. Stopping...`);
                clearInterval(intervalId); // 停止循环
            }

            // 添加点击后的延迟
            if (delay > 0) {
                setTimeout(() => {
                    console.log(`button ${id} Delay after click: ${delay}ms`);
                }, delay);
            }
        }

        // 使用 setInterval 实现循环点击
        const intervalId = setInterval(clickButton, interval);
    }

    function login() {
        const buttons = [
            { id: "#daily", interval: 1000, delay: 500 },
            { id: ".login-bouns", interval: 2000, delay: 2000 },
            { id: ".btn-secondary", interval: 2000, delay: 500 }
        ];

        buttons.forEach(buttonConfig => {
            const button = document.querySelector(buttonConfig.id);
            if (button) {
                startClick(buttonConfig.id, buttonConfig.interval, buttonConfig.delay);
            } else {
                console.error(`Button with ID ${buttonConfig.id} not found.`);
            }
        });

        // 在所有按钮点击完成后弹出提示
        setTimeout(() => {
            alert("今日已签到");
        }, 6000); // 假设所有操作在 6000ms 内完成
    }
    if (window.location.href === "https://18comic.vip/user/kafka97083/daily") {
        login();
    }

    // 在浏览器扩展的后台脚本中使用
    function openWebsiteDaily() {
        const targetHour = 2; // 每天9点
        const now = new Date();
        const targetTime = new Date();

        targetTime.setHours(targetHour, 35, 10, 0);

        // 如果今天已经过了目标时间，设置为明天
        if (now > targetTime) {
            targetTime.setDate(targetTime.getDate() + 1);
        }

        const delay = targetTime - now;

        setTimeout(() => {
            window.open('https://18comic.vip/user/kafka97083/daily', '_blank');
            // 设置下一次执行（每天）
            openWebsiteDaily();
        }, delay);
    }

    openWebsiteDaily();
    
})();
