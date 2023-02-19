const kb = require("./keyboardButtons.js");
module.exports = {
  home: [
    [
      {
        text: `${kb.home.reserve}`,
        callback_data: JSON.stringify({
          type: "reserve",
        }),
      },
    ],
    [
      {
        text: `${kb.home.about}`,
        callback_data: JSON.stringify({
          type: "aboute",
        }),
      },
    ],
  ],
  about: [
    [
      {
        text: `${kb.home.reserve}`,
        callback_data: JSON.stringify({
          type: "reserve",
        }),
      },
    ],
    [
      {
        text: `${kb.back}`,
        callback_data: JSON.stringify({
          type: "back",
        }),
      },
    ],
  ],
  userReserved: [
    [
      {
        text: `${kb.editDateReserved.text}`,
        callback_data: kb.userReserved.callback_data,
      },{
        text: `${kb.userReserved.text}`,
        callback_data: kb.canselReserved.callback_data,
      },
    ],
  ],
  superUser: [
    [
      {
        text: `${kb.superUser.text}`,
        callback_data: kb.userReserved.callback_data,
      },
    ],
  ],
};
