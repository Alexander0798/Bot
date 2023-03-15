module.exports = {
  home: {
    about: "О Мастере",
    reserve: "Записаться к Мастеру",
  },
  canselReserved: {
    text: `Отменить запись`,
    callback_data: JSON.stringify({
      type: "canselReserved",
    }),
  },
  editDateReserved: {
    text: `Изменить Дату`,
    callback_data: JSON.stringify({
      type: "editDateReserved",
    }),
  },
  userReserved: {
    text: 'Отменить запись',
    callback_data:  JSON.stringify({type: 'confirmedUserMerged'})
  },
  sActiveReserved: {
    text: 'Активные Записи',
    callback_data:  JSON.stringify({type: 'sActiveReserved'})
  }
};
