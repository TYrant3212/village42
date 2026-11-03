/* ===== Календарь бронирования ===== */
(function(){
  "use strict";

  // ЗАНЯТЫЕ ДАТЫ. Формат: "ГГГГ-ММ-ДД".
  // Сюда вписываются даты, когда дом уже забронирован.
  // Сейчас пусто — все даты свободны.
  const BUSY_DATES = [
    // "2026-11-20",
    // "2026-11-21",
  ];

  const PHONE = "+79043770909";

  const MONTHS = ["Январь","Февраль","Март","Апрель","Май","Июнь",
                  "Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
  const DOW = ["пн","вт","ср","чт","пт","сб","вс"];

  // начало с сегодняшнего дня, показываем 3 месяца вперёд
  const today = new Date();
  today.setHours(0,0,0,0);

  let viewMonth = today.getMonth();
  let viewYear  = today.getFullYear();

  const MAX_MONTH_OFFSET = 5; // сколько месяцев вперёд можно листать

  function fmt(y, m, d){
    return y + "-" + String(m+1).padStart(2,"0") + "-" + String(d).padStart(2,"0");
  }

  function isBusy(y,m,d){
    return BUSY_DATES.indexOf(fmt(y,m,d)) >= 0;
  }

  function build(days){
    // days — массив Date
  }

  function render(){
    const grid  = document.getElementById("calGrid");
    const label = document.getElementById("calMonth");
    const prev  = document.getElementById("calPrev");
    const next  = document.getElementById("calNext");
    if(!grid) return;

    label.textContent = MONTHS[viewMonth] + " " + viewYear;

    // границы листания
    const baseIdx = (viewYear - today.getFullYear()) * 12 + (viewMonth - today.getMonth());
    prev.disabled = baseIdx <= 0;
    next.disabled = baseIdx >= MAX_MONTH_OFFSET;
    prev.style.opacity = prev.disabled ? ".35" : "1";
    next.style.opacity = next.disabled ? ".35" : "1";

    grid.innerHTML = "";

    // заголовки дней недели
    DOW.forEach(function(d){
      const el = document.createElement("div");
      el.className = "cal-dow";
      el.textContent = d;
      grid.appendChild(el);
    });

    const first = new Date(viewYear, viewMonth, 1);
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    // сдвиг: в РФ неделя с понедельника
    let shift = first.getDay() - 1;
    if(shift < 0) shift = 6;

    for(let i = 0; i < shift; i++){
      const el = document.createElement("div");
      el.className = "cal-day empty";
      grid.appendChild(el);
    }

    for(let d = 1; d <= daysInMonth; d++){
      const el = document.createElement("div");
      const dateObj = new Date(viewYear, viewMonth, d);
      dateObj.setHours(0,0,0,0);

      el.className = "cal-day";
      el.textContent = d;

      if(dateObj < today){
        el.classList.add("past");
      } else if(isBusy(viewYear, viewMonth, d)){
        el.classList.add("busy");
        el.title = "Дата занята";
      } else {
        el.classList.add("free");
        el.title = "Свободно — нажмите, чтобы позвонить";
        el.addEventListener("click", function(){
          const nice = String(d).padStart(2,"0") + "." + String(viewMonth+1).padStart(2,"0") + "." + viewYear;
          window.location.href = "tel:" + PHONE;
          // небольшая подсказка
          const hint = document.getElementById("calHint");
          if(hint){
            hint.innerHTML = "<b>Вы выбрали " + nice + ".</b> Звоните — подтвердим бронь за пару минут.";
          }
        });
      }

      if(dateObj.getTime() === today.getTime()){
        el.classList.add("today");
      }

      grid.appendChild(el);
    }
  }

  document.addEventListener("DOMContentLoaded", function(){
    const prev = document.getElementById("calPrev");
    const next = document.getElementById("calNext");
    if(!prev || !next) return;

    prev.addEventListener("click", function(){
      viewMonth--;
      if(viewMonth < 0){ viewMonth = 11; viewYear--; }
      render();
    });

    next.addEventListener("click", function(){
      viewMonth++;
      if(viewMonth > 11){ viewMonth = 0; viewYear++; }
      render();
    });

    render();
  });
})();
