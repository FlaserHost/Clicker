"use strict";document.addEventListener("DOMContentLoaded",(()=>{const t=document.querySelector(".main-content");t.querySelector(".user-name > span").innerText="FlaserHost";const e=t.querySelector("#user-money"),o=t.querySelectorAll(".work-btn"),r=t.querySelectorAll(".level-up-btn"),c=t.querySelectorAll(".auto-btn"),s=t.querySelectorAll(".booster-btn"),a=[[c,"upgrade"],[s,"booster"]];let n=0;const i={cleaner:{job_level:1,job_difficult:1,job_current_cost:5,job_cost:15,job_UPD_price:50,automatic:{status:!1,price:7e4},booster:{status:!1,price:6e5}},courier:{job_level:0,job_difficult:2,job_current_cost:150,job_cost:150,job_UPD_price:3e3,automatic:{status:!1,price:15e4},booster:{status:!1,price:12e5}},factory:{job_level:0,job_difficult:3,job_current_cost:300,job_cost:300,job_UPD_price:1e4,automatic:{status:!1,price:28e4},booster:{status:!1,price:2e6}},office:{job_level:0,job_difficult:4,job_current_cost:600,job_cost:600,job_UPD_price:25e3,automatic:{status:!1,price:4e5},booster:{status:!1,price:31e5}}},l=[],u=(t,e)=>{t.forEach((t=>{const o=t.closest(".job__content").dataset.property,r=i[o].job_UPD_price;t.disabled=e<r}))},b=(t,e,o)=>{const r={upgrade:"automatic",booster:"booster"}[e];t.forEach((t=>{const c=t.closest(`.${e}`).dataset.property,s=i[c].job_level,a=i[c][r].status,n=i[c][r].price;t.disabled=0===s||!a&&o<n||a}))},_=(t,e)=>{const o=t.querySelector(".job-progress-bar"),c=o.getBoundingClientRect().width,s=o.children[0],l=t.dataset.property,_=i[l].job_difficult;s.style.transitionDuration=`${_}s`,s.style.width=`${c}px`,e.disabled=!0,setTimeout((()=>{const t=i[l].job_current_cost;n+=t,d(),s.style.transitionDuration="0s",s.style.width="0",u(r,n),a.forEach((([t,e])=>b(t,e,n))),i[l].automatic.status||(e.disabled=!1)}),1e3*_)},p=t=>{const e=t.closest("article"),o=e.dataset.property,c=t.dataset.property,s=i[o][c].price;return e.classList.remove("unbought"),t.disabled=!0,t.innerText={automatic:"Нанят",booster:"Куплено"}[c],n-=s,d(),u(r,n),a.forEach((([t,e])=>b(t,e,n))),o},d=()=>e.innerText=`${n.toLocaleString()} ₽`;o.forEach((t=>{t.addEventListener("click",(t=>{if(t.isTrusted){const e=t.target.closest(".job__content");_(e,t.target)}}))})),r.forEach((e=>{e.addEventListener("click",(e=>{const o=e.target.closest(".job__content"),c=o.dataset.property,s=i[c].job_UPD_price,l=o.querySelector(".job-level"),_=i[c].job_level+1;if(l.innerText=`Уровень ${_}`,i[c].job_level=_,1===_){o.parentElement.classList.remove("unbought");e.target.parentElement.children[0].disabled=!1;const r={upgrade:["automatic","Нанять"],booster:["booster","Купить"]};a.forEach((([e,o])=>{const s=t.querySelector(`.${o}[data-property="${c}"]`).querySelector("button"),a=r[o][0],n=r[o][1],l=i[c][a].price;s.innerHTML=`<span>${n}</span><span>${l.toLocaleString()} ₽</span>`}))}const p=o.querySelector(".job-cost"),j=i[c].job_current_cost+i[c].job_cost;p.innerText=`${j.toLocaleString()} ₽`,i[c].job_current_cost=j,n-=s;const y=2*s;e.target.innerHTML=`<span>Улучшить</span><span>${y.toLocaleString()} ₽</span>`,i[c].job_UPD_price=y,e.target.setAttribute("title",`Улучшить ${y.toLocaleString()} ₽`),d(),u(r,n),a.forEach((([t,e])=>b(t,e,n)))}))})),c.forEach((e=>{e.addEventListener("click",(e=>{const o=p(e.target);l.push(o),(e=>{for(let o=0;o<e.length;o++){const r=e[o],c=t.querySelector(`.job__content[data-property="${r}"]`),s=c.querySelector(".work-btn"),a=i[r].job_difficult;i[r].automatic.status||(_(c,s),i[r].automatic.status=!0,setInterval((()=>_(c,s)),1e3*a+100))}})(l);t.querySelector(`.job__content[data-property="${o}"] .work-btn`).innerText="Автоматически"}))})),s.forEach((e=>{e.addEventListener("click",(e=>{const o=p(e.target),r=i[o].job_current_cost*=3;i[o].job_current_cost=r,i[o].booster.status=!0;t.querySelector(`.job__content[data-property="${o}"] .job-cost`).innerText=`${r} ₽`}))})),u(r,n),a.forEach((([t,e])=>b(t,e,n)))}));