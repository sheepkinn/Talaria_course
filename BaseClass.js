// ==UserScript==
// @name         全自动抢课
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  锁定课程自动点击选课，精准点击btn_confirm确认
// @author       Sheepkinn
// @match        *://*/*
// @match        *://*.nbt.edu.cn/*
// @match        *://*.edu.cn/*
// @include      *
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  const TARGET_ID = "tr_XXXXXX";// 替换XXXXXX为你的课程ID
  const KEYWORD = "XXXXX";  // 替换XXXXX为你的课程关键词
  const CHECK_SPEED = 200;

  window.alert = function (msg) { console.log("已拦截Alert:", msg); return true; };
  window.confirm = function (msg) { console.log("已拦截Confirm:", msg); return true; };

  function autoRun() {
    checkConfirmButton();
    var targetRow = document.getElementById(TARGET_ID);

    if (targetRow) {
      monitorAndSnipe(targetRow);
    } else {
      if (Date.now() % 1000 < 200) {
        console.log("未找到目标课程，检查搜索状态...");
        doSearch();
      }
    }
  }

  function checkConfirmButton() {
    var confirmBtn = document.getElementById("btn_confirm");

    if (confirmBtn && confirmBtn.offsetParent !== null) {
      console.log("🔥🔥🔥 检测到【确认】弹窗 (btn_confirm)！正在点击！🔥🔥🔥");
      confirmBtn.click();
    }

    var allBtns = document.querySelectorAll("button.btn-primary");
    allBtns.forEach(b => {
      if (b.offsetParent !== null && b.innerText.trim() === "确 认") {
        b.click();
      }
    });
  }

  function doSearch() {
    var input = document.querySelector("input[name='searchInput']");
    var queryBtn = document.querySelector("button[name='query']");

    if (input && queryBtn) {
      if (input.value.trim() !== KEYWORD) {
        console.log("自动填入关键词：" + KEYWORD);
        input.value = KEYWORD;
        setTimeout(() => { queryBtn.click(); }, 200);
      } else {

        if (Date.now() % 3000 < 500) {
          queryBtn.click();
        }
      }
    }
  }

  function monitorAndSnipe(row) {
    var actionCell = row.querySelector("td.an");
    if (!actionCell) return;

    var statusText = actionCell.innerText.trim();

    if (statusText.includes("禁选")) {
      console.log("【监控中】" + KEYWORD + " - 等待开抢...");
    } else {
      console.log("🔥 禁选解除！点击选课！🔥");
      var btn = actionCell.querySelector("button, a, input");
      if (btn) {
        btn.click();
      } else {
        actionCell.click();
      }
    }
  }

  console.log(">>> test抢课脚本(含确认按钮) 已启动 <<<");
  setInterval(autoRun, CHECK_SPEED);

})();