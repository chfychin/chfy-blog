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
                        a + t > n.clientWidth && (a -= a + t - n.clientWidth + 10), a < 0 && (a = 10), o.style.cssText = `display:flex; height:${e}px; width:${t}px; left:${a}px; top:${i}px;`, o.innerHTML = `<img src= "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" onerror="this.onerror=null,this.src=&quot;/img/404.jpg&quot;" data-lazy-src="${l.target.src}">`
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

/*---一图流start---*/

// 首页一图流加载优化
/**
 * @description 实现medium的渐进加载背景的效果
 */
(function () {
    class ProgressiveLoad {
        constructor(smallSrc, largeSrc) {
            this.smallSrc = smallSrc;
            this.largeSrc = largeSrc;
            this.initTpl();
            this.container.addEventListener('animationend', () => {
                this.smallStage.style.display = 'none';
            }, { once: true });
        }

        initTpl() {
            this.container = document.createElement('div');
            this.smallStage = document.createElement('div');
            this.largeStage = document.createElement('div');
            this.smallImg = new Image();
            this.largeImg = new Image();
            this.container.className = 'pl-container';
            this.smallStage.className = 'pl-img pl-blur';
            this.largeStage.className = 'pl-img';
            this.container.appendChild(this.smallStage);
            this.container.appendChild(this.largeStage);
            this.smallImg.onload = this._onSmallLoaded.bind(this);
            this.largeImg.onload = this._onLargeLoaded.bind(this);
        }

        progressiveLoad() {
            this.smallImg.src = this.smallSrc;
            this.largeImg.src = this.largeSrc;
        }

        _onLargeLoaded() {
            this.largeStage.classList.add('pl-visible');
            this.largeStage.style.backgroundImage = `url('${this.largeSrc}')`;
        }

        _onSmallLoaded() {
            this.smallStage.classList.add('pl-visible');
            this.smallStage.style.backgroundImage = `url('${this.smallSrc}')`;
        }
    }

    const executeLoad = (config, target) => {
        console.log('执行渐进背景替换');
        const isMobile = window.matchMedia('(max-width: 767px)').matches;
        const loader = new ProgressiveLoad(
            isMobile ? config.mobileSmallSrc : config.smallSrc,
            isMobile ? config.mobileLargeSrc : config.largeSrc
        );
        if (target.children[0]) {
            target.insertBefore(loader.container, target.children[0]);
        }
        loader.progressiveLoad();
    };

    const ldconfig = {
        light: {
            smallSrc: 'https://pcgdemo.chfychin.cn/img/default_cover_24.webp', //浅色模式 小图链接 尽可能配置小于100k的图片 
            largeSrc: 'https://pcgdemo.chfychin.cn/img/default_cover_24.webp', //浅色模式 大图链接 最终显示的图片
            mobileSmallSrc: 'https://pcgdemo.chfychin.cn/img/mb12.webp', //手机端浅色小图链接 尽可能配置小于100k的图片
            mobileLargeSrc: 'https://pcgdemo.chfychin.cn/img/mb12.webp', //手机端浅色大图链接 最终显示的图片
            enableRoutes: ['/'],
        },
        dark: {
            smallSrc: 'https://pcgdemo.chfychin.cn/img/default_cover_246.webp', //深色模式 小图链接 尽可能配置小于100k的图片 
            largeSrc: 'https://pcgdemo.chfychin.cn/img/default_cover_246.webp', //深色模式 大图链接 最终显示的图片
            mobileSmallSrc: 'https://pcgdemo.chfychin.cn/img/mb17.webp', //手机端深色模式小图链接 尽可能配置小于100k的图片
            mobileLargeSrc: 'https://pcgdemo.chfychin.cn/img/mb17.webp', //手机端深色大图链接 最终显示的图片
            enableRoutes: ['/'],
        },
    };

    const getCurrentTheme = () => {
        return document.documentElement.getAttribute('data-theme');
    }

    const onThemeChange = () => {
        const currentTheme = getCurrentTheme();
        const config = ldconfig[currentTheme];
        initProgressiveLoad(config);
        document.addEventListener("DOMContentLoaded", function () {
            initProgressiveLoad(config);
        });

        document.addEventListener("pjax:complete", function () {
            onPJAXComplete(config);
        });
    }

    let initTheme = getCurrentTheme();
    let initConfig = ldconfig[initTheme];
    initProgressiveLoad(initConfig);

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === "data-theme" && location.pathname === '/') {
                onThemeChange();
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"]
    });

    function initProgressiveLoad(config) {
        const container = document.querySelector('.pl-container');
        if (container) {
            container.remove();
        }
        const target = document.getElementById('page-header');
        if (target && target.classList.contains('full_page')) {
            executeLoad(config, target);
        }
    }

    function onPJAXComplete(config) {
        const target = document.getElementById('page-header');
        if (target && target.classList.contains('full_page')) {
            initProgressiveLoad(config);
        }
    }

})();

/*---一图流end---*/

/*---页脚添加动物start---*/

function initFooterAnimal() {
    const footerAnimal = document.getElementById('footer-animal');
    if (footerAnimal) {
        footerAnimal.remove();
    }

    const footerBar = document.querySelector('#footer-bar');
    if (!footerBar) {
        console.error('找不到指定元素');
        return;
    }

    const newFooterAnimal = document.createElement('div');
    newFooterAnimal.id = 'footer-animal';
    newFooterAnimal.innerHTML = `
        <img class="animal entered loaded"
            src="https://i1.wp.com/ruom.wuaze.com/i/2024/10/19/473503.webp"
            alt="动物" />
    `;
    footerBar.insertAdjacentElement('beforebegin', newFooterAnimal);

    if (!document.getElementById('footer-animal-style')) {
        const style = document.createElement('style');
        style.id = 'footer-animal-style';
        style.textContent = `
            #footer-animal {
                position: relative;
            }
            #footer-animal::before {
                content: '';
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 36px;
                background: url(https://i1.wp.com/ruom.wuaze.com/i/2024/10/19/351933.webp) repeat center / auto 100%;
                box-shadow: 0 4px 7px rgba(0,0,0,.15);
            }
            .animal {
                position: relative;
                max-width: min(974px, 100vw);
                margin: 0 auto;
                display: block;
            }
            #footer-bar {
                margin-top: 0 !important;
            }
            @media screen and (max-width: 1023px) {
                #footer-animal::before {
                    height: 4vw;
                }
            }
            [data-theme=dark] #footer-animal {
                filter: brightness(.8);
            }
        `;
        document.head.appendChild(style);
    }
}

document.addEventListener('DOMContentLoaded', initFooterAnimal);

document.addEventListener('pjax:complete', initFooterAnimal);

/*---页脚添加动物end---*/