const kb = require("./keyboardButtons.js");
module.exports = class buttonMonths {
  constructor(month, daysOfWeek, reservedUsers) {
    this.reservedUsers = reservedUsers;
    this.month = month;
    this.daysOfWeek = daysOfWeek;
    this.currentDate = new Date();
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.currentDay = this.currentDate.getDate();
    this.calendarKeyboards = [];
  }
  #getKeyboardsNavigation(month) {
    if (month === this.currentDate.getMonth()) {
      this.calendarKeyboards.push([
        { text: this.month[month] + " " + this.currentYear, callback_data: "0" },
        {
          text: ">>",
          callback_data: JSON.stringify({
            type: "toggleMonth",
            month: month + 1,
          }),
        },
      ]);
    }
    if (month > this.currentDate.getMonth() && month + 1 !== this.month.length) {
      this.calendarKeyboards.push([
        {
          text: "<<",
          callback_data: JSON.stringify({
            type: "toggleMonth",
            month: month - 1,
          }),
        },
        { text: this.month[month] + " " + this.currentYear, callback_data: "0" },
        {
          text: ">>",
          callback_data: JSON.stringify({
            type: "toggleMonth",
            month: month + 1,
          }),
        },
      ]);
    }
    if (month > this.currentDate.getMonth() && month + 1 === this.month.length) {
      this.calendarKeyboards.push([
        {
          text: "<<",
          callback_data: JSON.stringify({
            type: "toggleMonth",
            month: month - 1,
          }),
        },
        { text: this.month[month] + " " + this.currentYear, callback_data: "0" },
        {
          text: ">>",
          callback_data: JSON.stringify({
            type: "toggleMonth",
            month: this.currentMonth,
          }),
        },
      ]);
    }
  }
  #getDayOfWeek() {
    this.calendarKeyboards.push(
      this.daysOfWeek.map((dayWeek) => {
        return {
          text: `${dayWeek}`,
          callback_data: 0,
        };
      })
    );
  }
  #getPossibleDays(month) {
    this.firstDayOfMonth = new Date(this.currentYear, month, 7).getDay();
    // Последний день выбранного месяца
    this.lastDateOfMonth = new Date(this.currentYear, month + 1, 0).getDate();
    // Последний день предыдущего месяца

    let i = 1;
    this.day = [];
    do {
      let dow = new Date(this.currentYear, month, i).getDay();
      // Если первый день недели не понедельник показать последние дни предыдущего месяца
      let currentDey = i;
      let currentMonth = month;
      if (i < 10) {
        currentDey = `0${i}`;
      }
      if (month < 10) {
        currentMonth = `0${month}`;
      }
      if (i === 1) {
        let d = dow - 1;
        if (dow === 0) {
          d = 6;
        }
        for (let ii = 0; ii < d; ii++) {
          this.day.push({
            text: ` `,
            callback_data: 0,
          });
        }
      }
      // Записываем текущий день в цикл
      if (month === this.currentMonth && i <= this.currentDay) {
        this.day.push({
          text: ` `,
          callback_data: 0,
        });
      } else {
        this.day.push({
          text: `${i}`,
          callback_data: JSON.stringify({
            type: "reservedDate",
            date: {
              day: currentDey,
              month: currentMonth,
            },
          }),
        });
      }

      if (i === this.lastDateOfMonth) {
        if (this.day.length !== 7) {
          while (7 - this.day.length) {
            this.day.push({
              text: ` `,
              callback_data: 0,
            });
          }
          dow = 0;
        }
      }
      // закрыть строку в воскресенье
      if (dow === 0) {
        this.calendarKeyboards.push(JSON.parse(JSON.stringify(this.day)));
        this.day = [];
      }
      // Если последний день месяца не воскресенье, показать первые дни следующего месяца

      i++;
    } while (i <= this.lastDateOfMonth);
  }
  getCalendar(month) {
    if (!month) {
      month = this.currentMonth;
    }
    this.#getKeyboardsNavigation(month);
    this.#getDayOfWeek();
    this.#getPossibleDays(month);
    this.calendarKeyboards.push([{ ...kb.canselReserved }]);
    return { reply_markup: JSON.stringify({ inline_keyboard: this.calendarKeyboards }) };
  }
};
