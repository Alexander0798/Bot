const dayjs = require("dayjs");
const tz = require("dayjs-timezone-iana-plugin");
const utc = require("dayjs/plugin/utc");
const helper = require("../helper.js");
const kb = require("./keyboardButtons.js");
dayjs.extend(tz);
module.exports = class ButtonReserveTime {
  constructor(reservedHours, reservedMinutes, reservedUsers) {
    this.reservedHours = reservedHours;
    this.reservedMinutes = reservedMinutes;
    this.reservedUsers = reservedUsers;
    this.defaultButton = [[{ ...kb.editDateReserved }, { ...kb.canselReserved }]];
  }
  getButtonReservedTime(dateReserved) {
    this.buttonTime = this.reservedHours.map((hour) => {
      const dateUnix = dayjs(
        `2023-${+dateReserved.month + 1}-${dateReserved.day}  ${hour}:00 GMT`,
        ["YYYY", "YYYY-MM-DD", "YYYY-MM-DD HH:mm:ss"],
        false
      ).unix();

      const reservedHour = [
        {
          text: `${hour}:00`,
          callback_data: JSON.stringify({
            type: "reservedTime",
            date: dateUnix,
          }),
        },
      ];
      const reservedMinutes = this.reservedMinutes.map((minute) => {
        const dateUnix = dayjs(
          `2023-${+dateReserved.month + 1}-${dateReserved.day}  ${hour}:${minute} GMT`,
          ["YYYY", "YYYY-MM-DD", "YYYY-MM-DD HH:mm:ss"],
          false
        ).unix();
        return {
          text: `${hour}:${minute}`,
          callback_data: JSON.stringify({
            type: "reservedTime",
            date: dateUnix,
          }),
        };
      });
      const reservedTime = reservedHour.concat(reservedMinutes).filter((time) => {
        const reservedTimeExecutions = this.reservedUsers.filter((user) => {
         const buttonDate = JSON.parse(time.callback_data).date
          if(buttonDate === user.date || buttonDate + helper.intervalReserver > user.date && buttonDate - helper.intervalReserver < user.date ) {
            return user
          }
        });
        if (reservedTimeExecutions.length) {
          return undefined;
        }
        return time;
      });

      return reservedTime;
    });

    return { reply_markup: JSON.stringify({ inline_keyboard: this.defaultButton.concat(this.buttonTime) }) };
  }
};
