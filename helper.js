const dayjs = require("dayjs");
const tz = require("dayjs-timezone-iana-plugin");
dayjs.extend(tz);

module.exports = {
    superUserId: 1478881318,
    monthSpot: [0],
    intervalReserver: 3 * 3600 + 0 * 60,
    textStartSuperUser: `слушаюсь и повинуюсь`,
    timeAdjustmentInterval(minutes) {
        const TIME_ONE_MINUTES = 50;
        if (minutes > TIME_ONE_MINUTES) {
            return Math.abs(minutes - TIME_ONE_MINUTES);
        }
        if (minutes <= 0) {
            return Math.abs(minutes);
        }
        return minutes;
    },
    info(msg) {
        if (msg.message) {
            return {
                userName: msg.from.first_name,
                userId: msg.from.id,
                chatId: msg.message.chat.id,
                text: msg.message.text,
                messageId: msg.message.message_id,
                userUrl: `https://t.me/${msg.from.username}`,
            };
        }
        return { userName: msg.from.first_name, userId: msg.from.id, chatId: msg.chat.id, text: msg.text, messageId: msg.message_id };
    },
    textStart(userName) {
        return `${userName} a ну ка запишись ка на приём`;
    },

    getDateReserved(reservedDate, month) {
        return {
            day: dayjs(reservedDate * 1000)
                .tz("gmt")
                .format("DD"),
            month: month[
                +dayjs(reservedDate * 1000)
                    .tz("gmt")
                    .format("MM") - 1
            ],
            monthId: dayjs(reservedDate * 1000)
                .tz("gmt")
                .format("MM"),
            hour: dayjs(reservedDate * 1000)
                .tz("gmt")
                .format("HH"),
            minutes: dayjs(reservedDate * 1000)
                .tz("gmt")
                .format("mm"),
        };
    },
    month: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    daysOfWeek: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    reservedHours: [09, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    reservedMinutes: [10, 20, 30, 40, 50],
};
