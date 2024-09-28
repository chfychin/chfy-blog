var leonus = {
    linkCom: e => {
        var t = document.querySelector(".el-textarea__inner");
        "bf" == e ? (t.value = "```yml\n", t.value += "- name: \n  link: \n  avatar: \n  descr: \n  siteshot: ", t.value += "\n```", t.setSelectionRange(15, 15)) : (t.value = "站点名称：\n站点地址：\n头像链接：\n站点描述：\n站点截图：", t.setSelectionRange(5, 5)), t.focus()
    },
    owoBig: () => {
        if (!document.getElementById("post-comment") || document.body.clientWidth < 768) return;
        let e = 1,
            t = "",
            o = document.createElement("div"),
            n = document.querySelector("body");
        o.id = "owo-big", n.appendChild(o), new MutationObserver((l => {
            for (let a = 0; a < l.length; a++) {
                let i = l[a].addedNodes,
                    s = "";
                if (2 == i.length && "OwO-body" == i[1].className) s = i[1];
                else {
                    if (1 != i.length || "tk-comment" != i[0].className) continue;
                    s = i[0]
                }
                s.onmouseover = l => {
                    e && ("OwO-body" == s.className && "IMG" == l.target.tagName || "tk-owo-emotion" == l.target.className) && (e = 0, t = setTimeout((() => {
                        let e = 3 * l.path[0].clientHeight,
                            t = 3 * l.path[0].clientWidth,
                            a = l.x - l.offsetX - (t - l.path[0].clientWidth) / 2,
                            i = l.y - l.offsetY;
                        a + t > n.clientWidth && (a -= a + t - n.clientWidth + 10), a < 0 && (a = 10), o.style.cssText = `display:flex; height:${e}px; width:${t}px; left:${a}px; top:${i}px;`, o.innerHTML = `<img src="${l.target.src}">`
                    }), 300))
                }, s.onmouseout = () => {
                    o.style.display = "none", e = 1, clearTimeout(t)
                }
            }
        })).observe(document.getElementById("post-comment"), {
            subtree: !0,
            childList: !0
        })
    },
};

/*---纪念日start---*/

// anniversary.js

function initializeAnniversary() {
    function LunarDate(Year, Month, Day) {
        try {
            let solar = Lunar.fromYmdHms(Year, Month, Day, 0, 0, 0).getSolar();
            return new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay());
        } catch (error) {
            return LunarDate(Year, Month, Day - 1);
        }
    }
    // 计算两个日期之间的天数差
    function daysBetween(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.ceil((date2 - date1) / oneDay);
    }
    // 剩余天数
    function daysLeft(dateStr, isLunar) {
        const [Year, Month, Day] = dateStr.split("-").map(Number);
        let now = new Date();
        now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let anniversaryDate;
        if (isLunar) {
            anniversaryDate = LunarDate(now.getFullYear(), Month, Day);
            if (anniversaryDate < now) {
                anniversaryDate = LunarDate(now.getFullYear() + 1, Month, Day);
            }
        } else {
            anniversaryDate = new Date(now.getFullYear(), Month - 1, Day);
            if (anniversaryDate < now) {
                anniversaryDate = new Date(now.getFullYear() + 1, Month - 1, Day);
            }
        }
        return daysBetween(now, anniversaryDate);
    }
    // 经过天数
    function totalDays(dateStr, isLunar) {
        const [Year, Month, Day] = dateStr.split("-").map(Number);
        let now = new Date();
        now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let startDate;
        if (isLunar) {
            startDate = LunarDate(Year, Month, Day);
        } else {
            startDate = new Date(Year, Month - 1, Day);
        }
        return daysBetween(startDate, now);
    }
    // 返回目标或起始日期以及星期几
    function targetDate(dateStr, isLunar) {
        const [Year, Month, Day] = dateStr.split("-").map(Number);
        let now = new Date();
        now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let anniversaryDate;
        if (isLunar) {
            anniversaryDate = LunarDate(now.getFullYear(), Month, Day);
            if (anniversaryDate < now) {
                anniversaryDate = LunarDate(now.getFullYear() + 1, Month, Day);
            }
        } else {
            anniversaryDate = new Date(now.getFullYear(), Month - 1, Day);
            if (anniversaryDate < now) {
                anniversaryDate = new Date(now.getFullYear() + 1, Month - 1, Day);
            }
        }
        // 获取星期几
        const weekDay = anniversaryDate.toLocaleDateString('zh-CN', { weekday: 'long' });
        // 返回年月日加星期几
        const year = anniversaryDate.getFullYear();
        const month = (anniversaryDate.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，需要加1
        const day = anniversaryDate.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day} (${weekDay})`; // 使用'-'作为分隔符
        //   return anniversaryDate.toDateString();  // 直接返回斜杆日期
        // return anniversaryDate.toLocaleDateString('zh-CN');
    }
    // 返回目标或起始日期（根据 displayMode）
    function targetOrStartDate(dateStr, isLunar, displayMode) {
        if (displayMode === "elapsed") {
            return dateStr; // 如果是elapsed模式，直接返回配置的日期（起始日）
        } else {
            return targetDate(dateStr, isLunar); // 否则，显示目标日期和星期几
        }
    }

    const countdownElements = document.querySelectorAll(".countdown");
    const totalDaysElements = document.querySelectorAll(".total-days");
    const targetDateElements = document.querySelectorAll(".target-date");

    countdownElements.forEach(function (elem) {
        const dateStr = elem.getAttribute("data-date");
        const isLunar = elem.hasAttribute("data-lunar");
        const displayMode = elem.getAttribute("data-display-mode"); // 获取 display_mode
        let daysText;
        if (displayMode === "elapsed") {
            // 显示已经过去的天数
            daysText = totalDays(dateStr, isLunar);
            elem.nextElementSibling.textContent = "天了"; // 显示“天了”
        } else {
            // 显示剩余天数
            daysText = daysLeft(dateStr, isLunar);
            elem.nextElementSibling.textContent = "天后"; // 显示“天后”
        }
        elem.textContent = daysText;
    });

    totalDaysElements.forEach(function (elem) {
        const dateStr = elem.getAttribute("data-date");
        const isLunar = elem.hasAttribute("data-lunar");
        elem.textContent = totalDays(dateStr, isLunar);
    });

    // 显示目标或起始日期
    targetDateElements.forEach(function (elem) {
        const dateStr = elem.getAttribute("data-date");
        const isLunar = elem.hasAttribute("data-lunar");
        const displayMode = elem.getAttribute("data-display-mode"); // 获取 display_mode
        elem.textContent = targetOrStartDate(dateStr, isLunar, displayMode);
    });
}

// 初始页面加载
document.addEventListener("DOMContentLoaded", initializeAnniversary);

// 适配 pjax
document.addEventListener("pjax:complete", initializeAnniversary);

/*---纪念日end---*/