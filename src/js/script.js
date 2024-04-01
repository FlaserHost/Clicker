'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const userName = prompt('Как Вас зовут?');
    //const userName = 'FlaserHost';

    const mainContent = document.querySelector('.main-content');
    const userNameItem = mainContent.querySelector('.user-name > span');
    userNameItem.innerText = userName;

    const userMoney = mainContent.querySelector('#user-money');
    const workBtns = mainContent.querySelectorAll('.work-btn');
    const levelUpBtns = mainContent.querySelectorAll('.level-up-btn');
    const automaticUpgradeBtns = mainContent.querySelectorAll('.auto-btn');
    const boosterBtns = mainContent.querySelectorAll('.booster-btn');

    const checkUpgradeUpdates = [
        [automaticUpgradeBtns, 'upgrade'],
        [boosterBtns, 'booster']
    ];

    let currentUserMoney = 0;

    const jobs = {
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
        }
    };

    const automaticJobs = [];

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

    const autoLauncher = arr => {
        for (let i = 0; i < arr.length; i++) {
            const property = arr[i];
            const job = mainContent.querySelector(`.job__content[data-property="${property}"]`);
            const jobBtn = job.querySelector('.work-btn');
            const time = jobs[property].job_difficult;

            if (!jobs[property].automatic.status) {
                work(job, jobBtn);
                jobs[property].automatic.status = true;
            } else {
                continue;
            }

            setInterval(() => work(job, jobBtn), time * 1000 + 100);
        }
    }

    const checkUpdatesCategory = selector => {
        const btnsTitle = {
            automatic: 'Нанят',
            booster: 'Куплено'
        }

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

    const userMoneyUPD = () => userMoney.innerText = `${currentUserMoney.toLocaleString()} ₽`;

    workBtns.forEach(btn => {
        btn.addEventListener('click', e => {
            const currentJob = e.target.closest('.job__content');
            work(currentJob, e.target);
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
                currentJob.parentElement.classList.remove('unbought');
                const closestWorkBtn = e.target.parentElement.children[0];
                closestWorkBtn.disabled = false;

                const params = {
                    upgrade: ['automatic', 'Нанять'],
                    booster: ['booster', 'Купить']
                };

                checkUpgradeUpdates.forEach(([_, selector]) => {
                    const currentAutomatic = mainContent.querySelector(`.${selector}[data-property="${property}"]`);
                    const autoBtn = currentAutomatic.querySelector('button');
                    const field = params[selector][0];
                    const title = params[selector][1];
                    const autoPrice = jobs[property][field].price;
                    autoBtn.innerText = `${title} ${autoPrice.toLocaleString()} ₽`;
                });
            }

            const jobCost = currentJob.querySelector('.job-cost');
            const cost = jobs[property].job_current_cost;
            const newJobCost = cost + jobs[property].job_cost;

            jobCost.innerText = `${newJobCost.toLocaleString()} ₽`;
            jobs[property].job_current_cost = newJobCost;

            currentUserMoney -= price;

            const newUPDprice = price * 2;
            e.target.innerText = `Улучшить ${newUPDprice.toLocaleString()} ₽`;
            jobs[property].job_UPD_price = newUPDprice;
            e.target.setAttribute('title', `Улучшить ${newUPDprice.toLocaleString()} ₽`);

            userMoneyUPD();
            jobUpdateAvailable(levelUpBtns, currentUserMoney);
            checkUpgradeUpdates.forEach(([btns, selector]) => additionalUpdatesAvailable(btns, selector, currentUserMoney));
        });
    });

    automaticUpgradeBtns.forEach(btn => {
        btn.addEventListener('click', e => {
            const property = checkUpdatesCategory(e.target);

            automaticJobs.push(property);
            autoLauncher(automaticJobs);

            const jobWorkBtn = mainContent.querySelector(`.job__content[data-property="${property}"] .work-btn`);
            jobWorkBtn.innerText = 'Автоматически';
        });
    });

    boosterBtns.forEach(btn => {
        btn.addEventListener('click', e => {
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
});