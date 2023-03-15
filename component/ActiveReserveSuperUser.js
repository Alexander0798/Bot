module.exports = class ActiveReserveSuperUser {
    constructor(entries) {
        this.entries = entries;
    }
    getButtonEntries() {
        this.buttonsRecord = [];
        this.entries.forEach((record) => {
            this.buttonsRecord.push(
                [
                    {
                        text: `${record.userName} Запись на: ${record.dataReserve.month} ${record.dataReserve.day} в ${record.dataReserve.hour}:${record.dataReserve.minutes}`,
                        callback_data: 0,
                    },
                ],
                [
                    {
                        text: `Отменить запись`,
                        callback_data: JSON.stringify({
                            type: "sСancellation",
                            reserve: [record.userId, record.date]
                        }),
                    },
                    {
                        text: `Чат с клиентом`,
                        url: record.userUrl,
                    },
                ]
            );
        });
        console.log(this.buttonsRecord)
        return { reply_markup: JSON.stringify({ inline_keyboard: this.buttonsRecord }) };
    }
};
