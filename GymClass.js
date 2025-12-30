// ==UserScript==
// @name         体育课抢课脚本
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  强制运行
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
  const CHECK_SPEED = 800;
  window.alert = function (msg) { console.log("拦截Alert:", msg); return true; };
  window.confirm = function (msg) { console.log("拦截Confirm:", msg); return true; };

  var hasClickedTab = false;
  function autoRun() {
    var targetRow = document.getElementById(TARGET_ID);
    if (targetRow) {
      console.log(">>> 目标课程已在屏幕上，准备狙击...");
      monitorAndSnipe(targetRow);
      hasClickedTab = false;
    } else {
      console.log("未找到目标课程，尝试寻找【体育分项】标签...");
      if (!hasClickedTab || Date.now() % 3000 < 500) {
        clickSportTab();
      }
    }
    checkSubmitButton();  // 检测提交按钮
  }
  function clickSportTab() {

    var allLinks = document.querySelectorAll("a");
    var foundTab = false;

    for (var i = 0; i < allLinks.length; i++) {
      if (allLinks[i].innerText.includes("体育分项")) {
        console.log("🔥 找到【体育分项】标签，正在点击...");
        allLinks[i].click();
        foundTab = true;
        hasClickedTab = true;
        break;
      }
    }

    /*if (!foundTab) {
      console.log("未找到【体育分项】标签，尝试搜索框兜底...");
      doSearch();
    }*/
  }

  function monitorAndSnipe(row) {
    var actionCell = row.querySelector("td.an");
    if (!actionCell) return;

    if (actionCell.innerText.includes("禁选")) {
      console.log("【监控中】当前状态：禁选");
    } else {
      console.log("🔥 禁选解除！执行点击！🔥");
      var btn = actionCell.querySelector("button, a, input");
      if (btn) {
        btn.click();
      } else {
        actionCell.click(); // 没按钮就点格子
      }
    }
  }

  function doSearch() {
    var input = document.querySelector("input[name='searchInput']");
    var queryBtn = document.querySelector("button[name='query']");
    if (input && queryBtn && input.value !== "XXX") {// 替换XXX为你的课程关键词
      input.value = "XXX";// 替换XXX为你的课程关键词
      queryBtn.click();
    }
  }

  function checkSubmitButton() {
    var allBtns = document.querySelectorAll("button");
    allBtns.forEach(b => {
      if (b.innerText.includes("提交") || b.innerText.includes("确认")) {
        if (b.offsetParent !== null) {
          console.log("发现提交按钮，自动点击");
          b.click();
        }
      }
    });
  }

  console.log(">>> 浙大理工体育课脚本已启动 <<<");
  setInterval(autoRun, CHECK_SPEED);

})();