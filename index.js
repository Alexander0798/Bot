const TelegramApi = require("node-telegram-bot-api");
const ButtonMenu = require("./component/ButtonMonths.js");
const ButtonReserveTime = require("./component/ButtonReserveTime.js");
const config = require("./config.js");
const kb = require("./component/keyboardButtons.js");
const keyboard = require("./component/keyboard.js");
const user = require("./helper.js");
const mongoose = require("mongoose");
const CustomerAccount = require("./models/CustomerAccount.js");
const CalendarReserved = require("./models/CalendarReserved.js");
const dayjs = require("dayjs");
const tz = require("dayjs-timezone-iana-plugin");
const utc = require("dayjs/plugin/utc");
const helper = require("./helper.js");
const ActiveReserveSuperUser = require('./component/ActiveReserveSuperUser.js')
dayjs.extend(tz);
dayjs.extend(utc);

mongoose.set("strictQuery", false);
mongoose.connect(config.DB_URL, (err) => {
    if (err) throw err;
    console.log("MongoDb connected");
});

const bot = new TelegramApi(config.TOKEN, { polling: true });

bot.setMyCommands([{ command: "/start", description: "Start" }]);

bot.on("message", async (msg) => {
    const userInfo = user.info(msg);
    try {
        await bot.deleteMessage(userInfo.chatId, userInfo.messageId);
    } catch (err) {
        console.log(JSON.stringify(err).slice(0, 100), "userMsg");
    }
});

bot.onText(/\/start/, async (msg) => {
    
    const userInfo = user.info(msg);
    if (userInfo.userId === helper.superUserId) {
        bot.sendMessage(userInfo.chatId, helper.textStartSuperUser, { reply_markup: JSON.stringify({ inline_keyboard: keyboard.sHome }) });
        return;
    }
    const searchCustomerAccount = await CustomerAccount.find({
        userId: userInfo.userId,
    });
    const calendarReserved = await CalendarReserved.find({ superUserId: helper.superUserId });
    if (!calendarReserved.length) {
        const superUserDB = new CalendarReserved({
            superUserId: helper.superUserId,
            reservedDate: [],
        });
        superUserDB
            .save()
            .then(() => console.log("Данные о пользователе были добавлены в базу данных виджета"))
            .catch((err) => console.log("Произошла ошибка добавления данных в БД ", JSON.stringify(err).slice(0, 100)));
    }
    if (!searchCustomerAccount.length) {
        const userDB = new CustomerAccount({
            userId: userInfo.userId,
            chatId: userInfo.chatId,
            userName: userInfo.userName,
            reservedUsers: [],
        });
        userDB
            .save()
            .then(() => console.log("Данные о пользователе были добавлены в базу данных виджета"))
            .catch((err) => console.log("Произошла ошибка добавления данных в БД ", JSON.stringify(err).slice(0, 100)));
    }

    bot.sendMessage(userInfo.chatId, user.textStart(userInfo.userName), { reply_markup: JSON.stringify({ inline_keyboard: keyboard.home }) });
});
bot.on("callback_query", async (query) => {
    const userInfo = user.info(query);
    console.log(query)
    const data = query.data;
    if (JSON.parse(data)) {
        const params = JSON.parse(data);
        const calendarReserved = await CalendarReserved.find({
            superUserId: helper.superUserId,
        });

        const reservedUsers = calendarReserved[0].reservedUsers;

        const searchUserReservedIndex = reservedUsers.findIndex((user) => user.userId === userInfo.userId);
        const inlineButton = new ButtonMenu(helper.month, helper.daysOfWeek, reservedUsers);
        const buttonReserveTime = new ButtonReserveTime(helper.reservedHours, helper.reservedMinutes, reservedUsers);
        if (userInfo.userId === helper.superUserId) {
            switch (params.type) {
                case "sActiveReserved":
                const activeReserveSuperUser = new ActiveReserveSuperUser(reservedUsers)
                    bot.sendMessage(userInfo.chatId, helper.textStartSuperUser, activeReserveSuperUser.getButtonEntries())
                    return;
            }
        }
        switch (params.type) {
            case "reserve":
                try {
                    await bot.editMessageText("textReserve", {
                        chat_id: userInfo.chatId,
                        message_id: userInfo.messageId,
                        ...inlineButton.getCalendar(),
                    });
                } catch (err) {
                    console.log(JSON.stringify(err).slice(0, 100), "reserve");
                }

                break;
            case "aboute":
                try {
                    await bot.editMessageText(`пошли на хуй Я псих`, {
                        chat_id: userInfo.chatId,
                        message_id: userInfo.messageId,
                        reply_markup: JSON.stringify({
                            inline_keyboard: keyboard.about,
                        }),
                    });
                } catch (err) {
                    console.log(JSON.stringify(err).slice(0, 100), "aboute");
                }

                break;
            case "canselReserved":
                if (searchUserReservedIndex + 1) {
                    reservedUsers.splice(searchUserReservedIndex, searchUserReservedIndex + 1);
                    await CalendarReserved.findByIdAndUpdate(calendarReserved[0]._id, {
                        reservedUsers: reservedUsers,
                    })
                        .then(() => console.log("Условие задачи удалено"))
                        .catch((err) => console.log("Произошла ошибка удаления данных из БД ", err));
                }
                try {
                    await bot.editMessageText(user.textStart(userInfo.userName), {
                        chat_id: userInfo.chatId,
                        message_id: userInfo.messageId,
                        reply_markup: JSON.stringify({
                            inline_keyboard: keyboard.home,
                        }),
                    });
                } catch (err) {
                    console.log(JSON.stringify(err).slice(0, 100), "canselReserved");
                }

                break;
            case "editDateReserved":
                try {
                    await bot.editMessageText(`${userInfo.userName} Выберите Дату Записи`, {
                        chat_id: userInfo.chatId,
                        message_id: userInfo.messageId,
                        ...inlineButton.getCalendar(),
                    });
                } catch (err) {
                    console.log(JSON.stringify(err).slice(0, 100), "editDateReserve");
                }

                break;
            case "toggleMonth":
                try {
                    await bot.editMessageText(`Запись на ${helper.month[params.month]}`, {
                        chat_id: userInfo.chatId,
                        message_id: userInfo.messageId,
                        ...inlineButton.getCalendar(params.month),
                    });
                } catch (err) {
                    console.log(JSON.stringify(err).slice(0, 100), "toggleMonth");
                }

                break;
            case "reservedDate":
                try {
                    await bot.editMessageText(`Запись на ${helper.month[+params.date.month]} ${params.date.day}. Веберите Удобное Для Вас Время`, {
                        chat_id: userInfo.chatId,
                        message_id: userInfo.messageId,

                        ...buttonReserveTime.getButtonReservedTime(params.date),
                    });
                } catch (err) {
                    console.log(JSON.stringify(err).slice(0, 100), "reservedDate");
                }
                break;
            case "reservedTime":
                const searchUserReserved = reservedUsers?.find((user) => user.userId === userInfo.userId);
                if (!searchUserReserved) {
                    const reservedUser = {
                        chat_id: userInfo.chatId,
                        message_id: userInfo.messageId,
                        userId: userInfo.userId,
                        userName: userInfo.userName,
                        userUrl: userInfo.userUrl,
                        date: params.date,
                        dataReserve: helper.getDateReserved(params.date, helper.month),
                    };
                    CalendarReserved.findByIdAndUpdate(calendarReserved[0]._id, {
                        $push: {
                            reservedUsers: reservedUser,
                        },
                    })
                        .then(() => {
                            console.log("Данные о пользователе были успешно изменены в базе данных виджета");
                        })
                        .catch((err) => {
                            console.log("Произошла ошибка добавления данных в БД ", err);
                            return;
                        });
                    const textUserReserved = `${reservedUser.userName} Ожидайте пожалуиста Подтверждения Записи! Вы записаны на
          ${reservedUser.dataReserve.month}, число: ${reservedUser.dataReserve.day}, время: ${reservedUser.dataReserve.hour + ":" + reservedUser.dataReserve.minutes}`;
                    try {
                        await bot.editMessageText(textUserReserved, {
                            chat_id: userInfo.chatId,
                            message_id: userInfo.messageId,
                            reply_markup: JSON.stringify({
                                inline_keyboard: keyboard.userReserved,
                            }),
                        });
                    } catch (err) {
                        console.log(JSON.stringify(err).slice(0, 100), "reservedTime");
                    }
                } else {
                    const textUserReserved = `${searchUserReserved.userName} Ожидайте пожалуиста Подтверждения Записи! Вы записаны на
          ${searchUserReserved.dataReserve.month}, число: ${searchUserReserved.dataReserve.day}, время: ${
                        searchUserReserved.dataReserve.hour + ":" + searchUserReserved.dataReserve.minutes
                    }`;
                    try {
                        await bot.editMessageText(textUserReserved, {
                            chat_id: userInfo.chatId,
                            message_id: userInfo.messageId,
                            reply_markup: JSON.stringify({
                                inline_keyboard: keyboard.userReserved,
                            }),
                        });
                    } catch (err) {
                        console.log(JSON.stringify(err).slice(0, 100), "reservedTime");
                    }
                }
                break;
            case "confirmedUserMerged":
                if (searchUserReservedIndex + 1) {
                    reservedUsers.splice(searchUserReservedIndex, searchUserReservedIndex + 1);
                    await CalendarReserved.findByIdAndUpdate(calendarReserved[0]._id, {
                        reservedUsers: reservedUsers,
                    })
                        .then(() => console.log("Условие задачи удалено"))
                        .catch((err) => console.log("Произошла ошибка удаления данных из БД ", err));
                }
                try {
                    await bot.editMessageText(`${userInfo.userName} Выберите Дату Записи`, {
                        chat_id: userInfo.chatId,
                        message_id: userInfo.messageId,
                        ...inlineButton.getCalendar(),
                    });
                } catch (err) {
                    console.log(JSON.stringify(err).slice(0, 100), "reservedTime");
                }
                break;
        }
    } else {
        return;
    }
});
