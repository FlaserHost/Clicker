"use strict";document.addEventListener("DOMContentLoaded",(()=>{const t=prompt("Как Вас зовут?"),e=document.querySelector(".main-content");e.querySelector(".user-name > span").innerText=t;const o=e.querySelector("#user-money"),r=e.querySelectorAll(".work-btn"),c=e.querySelectorAll(".level-up-btn"),s=e.querySelectorAll(".auto-btn"),n=e.querySelectorAll(".booster-btn"),a=[[s,"upgrade"],[n,"booster"]];let i=0;const l={cleaner:{job_level:1,job_difficult:1,job_current_cost:5,job_cost:15,job_UPD_price:50,automatic:{status:!1,price:7e4},booster:{status:!1,price:6e5}},courier:{job_level:0,job_difficult:2,job_current_cost:150,job_cost:150,job_UPD_price:3e3,automatic:{status:!1,price:15e4},booster:{status:!1,price:12e5}},factory:{job_level:0,job_difficult:3,job_current_cost:300,job_cost:300,job_UPD_price:1e4,automatic:{status:!1,price:28e4},booster:{status:!1,price:2e6}},office:{job_level:0,job_difficult:4,job_current_cost:600,job_cost:600,job_UPD_price:25e3,automatic:{status:!1,price:4e5},booster:{status:!1,price:31e5}}},u=[],b=(t,e)=>{t.forEach((t=>{const o=t.closest(".job__content").dataset.property,r=l[o].job_UPD_price;t.disabled=e<r}))},_=(t,e,o)=>{const r={upgrade:"automatic",booster:"booster"}[e];t.forEach((t=>{const c=t.closest(`.${e}`).dataset.property,s=l[c].job_level,n=l[c][r].status,a=l[c][r].price;t.disabled=0===s||!n&&o<a||n}))},d=(t,e)=>{const o=t.querySelector(".job-progress-bar"),r=o.getBoundingClientRect().width,s=o.children[0],n=t.dataset.property,u=l[n].job_difficult;s.style.transitionDuration=`${u}s`,s.style.width=`${r}px`,e.disabled=!0,setTimeout((()=>{const t=l[n].job_current_cost;i+=t,j(),s.style.transitionDuration="0s",s.style.width="0",b(c,i),a.forEach((([t,e])=>_(t,e,i))),l[n].automatic.status||(e.disabled=!1)}),1e3*u)},p=t=>{const e=t.closest("article"),o=e.dataset.property,r=t.dataset.property,s=l[o][r].price;return e.classList.remove("unbought"),t.disabled=!0,t.innerText={automatic:"Нанят",booster:"Куплено"}[r],i-=s,j(),b(c,i),a.forEach((([t,e])=>_(t,e,i))),o},j=()=>o.innerText=`${i.toLocaleString()} ₽`;r.forEach((t=>{t.addEventListener("click",(t=>{if(t.isTrusted){const e=t.target.closest(".job__content");d(e,t.target)}}))})),c.forEach((t=>{t.addEventListener("click",(t=>{const o=t.target.closest(".job__content"),r=o.dataset.property,s=l[r].job_UPD_price,n=o.querySelector(".job-level"),u=l[r].job_level+1;if(n.innerText=`Уровень ${u}`,l[r].job_level=u,1===u){o.parentElement.classList.remove("unbought");t.target.parentElement.children[0].disabled=!1;const c={upgrade:["automatic","Нанять"],booster:["booster","Купить"]};a.forEach((([t,o])=>{const s=e.querySelector(`.${o}[data-property="${r}"]`).querySelector("button"),n=c[o][0],a=c[o][1],i=l[r][n].price;s.innerText=`${a} ${i.toLocaleString()} ₽`}))}const d=o.querySelector(".job-cost"),p=l[r].job_current_cost+l[r].job_cost;d.innerText=`${p.toLocaleString()} ₽`,l[r].job_current_cost=p,i-=s;const y=2*s;t.target.innerText=`Улучшить ${y.toLocaleString()} ₽`,l[r].job_UPD_price=y,t.target.setAttribute("title",`Улучшить ${y.toLocaleString()} ₽`),j(),b(c,i),a.forEach((([t,e])=>_(t,e,i)))}))})),s.forEach((t=>{t.addEventListener("click",(t=>{const o=p(t.target);u.push(o),(t=>{for(let o=0;o<t.length;o++){const r=t[o],c=e.querySelector(`.job__content[data-property="${r}"]`),s=c.querySelector(".work-btn"),n=l[r].job_difficult;l[r].automatic.status||(d(c,s),l[r].automatic.status=!0,setInterval((()=>d(c,s)),1e3*n+100))}})(u);e.querySelector(`.job__content[data-property="${o}"] .work-btn`).innerText="Автоматически"}))})),n.forEach((t=>{t.addEventListener("click",(t=>{const o=p(t.target),r=l[o].job_current_cost*=3;l[o].job_current_cost=r,l[o].booster.status=!0;e.querySelector(`.job__content[data-property="${o}"] .job-cost`).innerText=`${r} ₽`}))})),b(c,i),a.forEach((([t,e])=>_(t,e,i)))}));