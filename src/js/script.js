'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('.main-content');
    const stageSections = mainContent.querySelectorAll('.content-area');
    const userNameItem = mainContent.querySelector('.user-name > span');
    let userName = '';

    const userMoney = mainContent.querySelector('#user-money');
    const workBtns = mainContent.querySelectorAll('.work-btn');
    const levelUpBtns = mainContent.querySelectorAll('.level-up-btn');
    const automaticUpgradeBtns = mainContent.querySelectorAll('.auto-btn');
    const boosterBtns = mainContent.querySelectorAll('.booster-btn');

    const checkUpgradeUpdates = [
        [automaticUpgradeBtns, 'upgrade'],
        [boosterBtns, 'booster']
    ];

    const params = {
        upgrade: ['automatic', 'Нанять'],
        booster: ['booster', 'Купить']
    };

    const btnsTitle = {
        automatic: 'Нанят',
        booster: 'Куплено'
    }

    let currentUserMoney = 0;
    const userMoneyUPD = () => userMoney.innerText = `${currentUserMoney.toLocaleString()} ₽`;

    let jobs = {
        cleaner: {
            job_level: 1,
            job_difficult: 1,
            job_current_cost: 5,
            job_cost: 15,
            job_UPD_price: 50,
            automatic: {
                status: false,
                price: 70000
            },
            booster: {
                status: false,
                price: 600000
            }
        },
        courier: {
            job_level: 0,
            job_difficult: 2,
            job_current_cost: 150,
            job_cost: 150,
            job_UPD_price: 3000,
            automatic: {
                status: false,
                price: 150000
            },
            booster: {
                status: false,
                price: 1200000
            }
        },
        factory: {
            job_level: 0,
            job_difficult: 3,
            job_current_cost: 300,
            job_cost: 300,
            job_UPD_price: 10000,
            automatic: {
                status: false,
                price: 280000
            },
            booster: {
                status: false,
                price: 2000000
            }
        },
        office: {
            job_level: 0,
            job_difficult: 4,
            job_current_cost: 600,
            job_cost: 600,
            job_UPD_price: 25000,
            automatic: {
                status: false,
                price: 400000
            },
            booster: {
                status: false,
                price: 3100000
            }
        },
        car_dealership: {
            job_level: 0,
            job_difficult: 5,
            job_current_cost: 3000,
            job_cost: 3000,
            job_UPD_price: 250000,
            automatic: {
                status: false,
                price: 600000
            },
            booster: {
                status: false,
                price: 5200000
            }
        },
        nightclub: {
            job_level: 0,
            job_difficult: 6,
            job_current_cost: 300000,
            job_cost: 300000,
            job_UPD_price: 550000,
            automatic: {
                status: false,
                price: 1500000
            },
            booster: {
                status: false,
                price: 7200000
            }
        },
        strip_club: {
            job_level: 0,
            job_difficult: 7,
            job_current_cost: 300000,
            job_cost: 300000,
            job_UPD_price: 1000000,
            automatic: {
                status: false,
                price: 2500000
            },
            booster: {
                status: false,
                price: 4200000
            }
        },
        restaurant_chain: {
            job_level: 0,
            job_difficult: 8,
            job_current_cost: 300000,
            job_cost: 300000,
            job_UPD_price: 2500000,
            automatic: {
                status: false,
                price: 5500000
            },
            booster: {
                status: false,
                price: 7200000
            }
        },
    };

    let automaticJobs = [];

    const checkUpdates = (currentJob, selector, property) => {
        currentJob.parentElement.classList.remove('unbought');
        const closestWorkBtn = selector.parentElement.children[0];
        closestWorkBtn.disabled = false;

        checkUpgradeUpdates.forEach(([_, selector]) => {
            const currentAutomatic = mainContent.querySelector(`.${selector}[data-property="${property}"]`);
            const autoBtn = currentAutomatic.querySelector('button');
            const field = params[selector][0];
            const title = params[selector][1];
            const autoPrice = jobs[property][field].price;
            const status = jobs[property][field].status;
            autoBtn.innerHTML = !status ? `<span>${title}</span><span>${autoPrice.toLocaleString()} ₽</span>` : btnsTitle[field];

            if (status) {
                currentAutomatic.classList.remove('unbought');
            }
        });
    }

    const automaticTitle = property => {
        const jobWorkBtn = mainContent.querySelector(`.job__content[data-property="${property}"] .work-btn`);
        jobWorkBtn.innerText = 'Автоматически';
    }

    const work = (job, btn) => {
        const jobProgressBar = job.querySelector('.job-progress-bar');
        const width = jobProgressBar.getBoundingClientRect().width;
        const jobProgressThumb = jobProgressBar.children[0];

        const property = job.dataset.property;
        const time = jobs[property].job_difficult;

        jobProgressThumb.style.transitionDuration = `${time}s`;
        jobProgressThumb.style.width = `${width}px`;
        btn.disabled = true;

        setTimeout(() => {
            const jobCost = jobs[property].job_current_cost;
            currentUserMoney += jobCost;

            userMoneyUPD();

            jobProgressThumb.style.transitionDuration = '0s';
            jobProgressThumb.style.width = `0`;

            jobUpdateAvailable(levelUpBtns, currentUserMoney);
            checkUpgradeUpdates.forEach(([btns, selector]) => additionalUpdatesAvailable(btns, selector, currentUserMoney));

            if (!jobs[property].automatic.status) {
                btn.disabled = false;
            }
        }, time * 1000);
    }

    const autoLauncher = (arr, restore = false) => {
        for (let i = 0; i < arr.length; i++) {
            const property = arr[i];
            const job = mainContent.querySelector(`.job__content[data-property="${property}"]`);
            const jobBtn = job.querySelector('.work-btn');
            const time = jobs[property].job_difficult;

            if (!jobs[property].automatic.status || restore) {
                work(job, jobBtn);
                jobs[property].automatic.status = true;
                automaticTitle(property);
            } else {
                continue;
            }

            setInterval(() => work(job, jobBtn), time * 1000 + 100);
        }
    }

    if (localStorage.savedData) {
        const savedData = JSON.parse(localStorage.savedData);
        jobs = {...savedData.jobs};

        const jobContents = mainContent.querySelectorAll('.job__content');
        jobContents.forEach(job => {
            const property = job.dataset.property;
            const level = jobs[property].job_level;

            if (level > 0) {
                const jobTitle = job.querySelector('.job-title');
                const jobLevel = jobTitle.children[1];
                const jobCost = jobTitle.children[2];
                const cost = jobs[property].job_current_cost;

                jobLevel.innerText = `Уровень ${level}`;
                jobCost.innerText = `${cost} ₽`;

                const jobUPDprice = jobs[property].job_UPD_price;
                const levelUpBtn = job.querySelector('.level-up-btn');
                levelUpBtn.innerHTML = `<span>Улучшить</span><span>${jobUPDprice} ₽</span>`;

                checkUpdates(job, levelUpBtn, property);
            }
        });

        currentUserMoney = savedData.currentUserMoney;
        userMoneyUPD();

        if (savedData.automaticJobs.length !== 0) {
            automaticJobs = [...savedData.automaticJobs];
            autoLauncher(automaticJobs, true);
        }

        userName = savedData.userName;
    } else {
        userName = prompt('Как Вас зовут?');
    }

    userNameItem.innerText = userName;

    const jobUpdateAvailable = (upgradeBtns, currentMoney) => {
        upgradeBtns.forEach(btn => {
            const property = btn.closest('.job__content').dataset.property;
            const upgradePrice = jobs[property].job_UPD_price;
            btn.disabled = currentMoney < upgradePrice;
        });
    }

    const additionalUpdatesAvailable = (upgrades, selector, currentMoney) => {
        const fields = {
            upgrade: 'automatic',
            booster: 'booster'
        };

        const field = fields[selector];

        upgrades.forEach(btn => {
            const property = btn.closest(`.${selector}`).dataset.property;
            const jobLevel = jobs[property].job_level;
            const status = jobs[property][field].status;
            const UPDprice = jobs[property][field].price;
            btn.disabled = jobLevel === 0 || (!status && currentMoney < UPDprice) || status;
        });
    }

    const checkUpdatesCategory = selector => {
        const grandParent = selector.closest('article');
        const property = grandParent.dataset.property;
        const selfProperty = selector.dataset.property;
        const price = jobs[property][selfProperty].price;
        grandParent.classList.remove('unbought');
        selector.disabled = true;
        selector.innerText = btnsTitle[selfProperty];
        currentUserMoney -= price;

        userMoneyUPD();
        jobUpdateAvailable(levelUpBtns, currentUserMoney);
        checkUpgradeUpdates.forEach(([btns, selector]) => additionalUpdatesAvailable(btns, selector, currentUserMoney));

        return property;
    }

    workBtns.forEach(btn => {
        btn.addEventListener('click', e => {
            if (e.isTrusted) {
                const currentJob = e.target.closest('.job__content');
                work(currentJob, e.target);
            }
        });
    });

    levelUpBtns.forEach(btn=> {
        btn.addEventListener('click', e => {
            const currentJob = e.target.closest('.job__content');
            const property = currentJob.dataset.property;
            const price = jobs[property].job_UPD_price;

            const jobLevel = currentJob.querySelector('.job-level');
            const level = jobs[property].job_level + 1;

            jobLevel.innerText = `Уровень ${level}`;
            jobs[property].job_level = level;

            if (level === 1) {
                checkUpdates(currentJob, e.target, property);
            }

            const jobCost = currentJob.querySelector('.job-cost');
            const cost = jobs[property].job_current_cost;
            const newJobCost = cost + jobs[property].job_cost;

            jobCost.innerText = `${newJobCost.toLocaleString()} ₽`;
            jobs[property].job_current_cost = newJobCost;

            currentUserMoney -= price;

            const newUPDprice = price * 2;
            e.target.innerHTML = `<span>Улучшить</span><span>${newUPDprice.toLocaleString()} ₽</span>`;
            jobs[property].job_UPD_price = newUPDprice;
            e.target.setAttribute('title', `Улучшить ${newUPDprice.toLocaleString()} ₽`);

            userMoneyUPD();
            jobUpdateAvailable(levelUpBtns, currentUserMoney);
            checkUpgradeUpdates.forEach(([btns, selector]) => additionalUpdatesAvailable(btns, selector, currentUserMoney));
        });
    });

    automaticUpgradeBtns.forEach(btn => {
        btn.addEventListener('click', e => {
            const property = e.target.closest('article').dataset.property;
            automaticJobs.push(property);
            autoLauncher(automaticJobs);
            automaticTitle(property);
            checkUpdatesCategory(e.target);
        });
    });

    boosterBtns.forEach(btn => {
        btn.addEventListener('click', e => {
            e.target.setAttribute('data-bought', true);
            const property = checkUpdatesCategory(e.target);
            const multiplyValue = jobs[property].job_current_cost *= 3;
            jobs[property].job_current_cost = multiplyValue;
            jobs[property].booster.status = true;

            const jobCost = mainContent.querySelector(`.job__content[data-property="${property}"] .job-cost`);
            jobCost.innerText = `${multiplyValue} ₽`;
        });
    });

    jobUpdateAvailable(levelUpBtns, currentUserMoney);
    checkUpgradeUpdates.forEach(([btns, selector]) => additionalUpdatesAvailable(btns, selector, currentUserMoney));

    // кнопки навигации

    const navBtns = mainContent.querySelectorAll('.nav-btn');
    navBtns.forEach((btn, _, arr) => {
        btn.addEventListener('click', e => {
            arr.forEach(item => item.classList.remove('active'));
            e.target.classList.add('active');
            stageSections.forEach(stage => stage.classList.remove('show'));
            const id = e.target.dataset.id;
            const stageSection = mainContent.querySelector(`#${id}`);
            stageSection.classList.add('show');
        });
    });

    // зона работы с сохранениями

    let clearData = false;

    const deleteData = mainContent.querySelector('#data-reset');
    deleteData.addEventListener('click', () => {
        clearData = true;
        location.reload();
    });

    const visualSettingsBtn = mainContent.querySelector('#visual-settings');
    visualSettingsBtn.addEventListener('click', e => {
        const parent = e.target.parentElement;
        parent.style.display = 'none';
        parent.nextElementSibling.style.display = 'block';
    });

    let timer;
    const defaultColors = {
        background: {
            color: '#0D0E26',
            action: color => document.documentElement.style.setProperty('--bg-color', color),
        },
        text: {
            color: '#fff',
            action: color => {
                document.documentElement.style.setProperty('--transition-time', '0s');
                document.documentElement.style.setProperty('--text-color', color);

                clearTimeout(timer);
                timer = setTimeout(() => document.documentElement.style.setProperty('--transition-time', '.3s'), 500);
            }
        },
        border: {
            color: '#23204F',
            action: color => {
                document.documentElement.style.setProperty('--transition-time', '0s');
                document.documentElement.style.setProperty('--border-color', color);

                clearTimeout(timer);
                timer = setTimeout(() => document.documentElement.style.setProperty('--transition-time', '.3s'), 500);
            }
        },
        hover_nav: {
            color: '#23204F',
            action: color => {
                document.documentElement.style.setProperty('--nav-btn-hover', color);
            }
        }
    };

    const colorpickerElem = mainContent.querySelector('#picker');
    const colorBtns = mainContent.querySelectorAll('.color-btn');
    colorBtns.forEach(btn => {
        btn.addEventListener('click', e => {
            const property = e.target.dataset.property;
            colorpickerElem.style.display = 'block';

            const colorpickerContent = colorpickerElem.querySelector('.IroColorPicker');
            if (colorpickerContent) {
                colorpickerContent.remove();
            }

            const colorPicker = new iro.ColorPicker('#picker', {
                width: 320,
                color: defaultColors[property].color
            });

            colorPicker.on('color:change', color => {
                defaultColors[property].action(color.hexString);
            });
        });
    });

    window.onunload = window.onbeforeunload = e => {
        e.preventDefault();
        e.returnValue = 'Уверены что хотите уйти?';

        if (!clearData) {
            const savedElements = {
                jobs,
                automaticJobs,
                userName,
                currentUserMoney
            };

            localStorage.savedData = JSON.stringify(savedElements);
        } else {
            localStorage.savedData = '';
        }
    }
});