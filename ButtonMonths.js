module.exports = class buttonMonths {
  #month = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  #currentDate = new Date();

  #getPossibleMonth() {
    const getMonth = this.#currentDate.getMonth();
    const getPpossibleMonth = this.#month.map((item, index) => {
      if (index >= getMonth) {
        return { callback_data: index, text: item };
      }
    });
    const result = getPpossibleMonth.filter((item) => Boolean(item));
    return result;
  }
  getPossibleDays(month) {
    console.log(month)
    const maxDays = new Date(this.#currentDate.getFullYear(), month, 0).getDate();
    const keyboardsDay = Array.from({ length: maxDays }, (v, i) => i + 1);
    let keyboardsMonth = [];
 
    for (let i = 0; i < keyboardsDay.length; i = i + 4) {
      let el = [];
      if (keyboardsDay[i]) {
        el.push({
          text: `${keyboardsDay[i]}`,
          callback_data: `${keyboardsDay[i]}`,
        });
      }
      if (keyboardsDay[i + 1]) {
        el.push({
          text: `${keyboardsDay[i + 1]}`,
          callback_data: `${keyboardsDay[i + 1]}`,
        });
      }
      if (keyboardsDay[i + 2]) {
        el.push({
          text: `${keyboardsDay[i + 2]}`,
          callback_data: `${keyboardsDay[i + 2]}`,
        });
      }
      if (keyboardsDay[i + 3]) {
        el.push({
          text: `${keyboardsDay[i + 3]}`,
          callback_data: `${keyboardsDay[i + 3]}`,
        });
      }
      keyboardsMonth.push(el);
    }
  
    return { reply_markup: JSON.stringify({ inline_keyboard: keyboardsMonth }) };
  }

  
  getMonthOptions() {
    this.possibleMonth = this.#getPossibleMonth();
    let keyboardsMonth = [];

    for (let i = 0; i < this.possibleMonth.length; i = i + 3) {
      let el = [];
      if (this.possibleMonth[i]?.text) {
        el.push({
          text: `${this.possibleMonth[i].text}`,
          callback_data: `${this.possibleMonth[i].callback_data + 1}`,
        });
      }
      if (this.possibleMonth[i + 1]?.text) {
        el.push({
          text: `${this.possibleMonth[i + 1].text}`,
          callback_data: `${this.possibleMonth[i + 1].callback_data + 1}`,
        });
      }
      if (this.possibleMonth[i + 2]?.text) {
        el.push({
          text: `${this.possibleMonth[i + 2].text}`,
          callback_data: `${this.possibleMonth[i + 2].callback_data + 1}`,
        });
      }
      keyboardsMonth.push(el);
    }
    return { reply_markup: JSON.stringify({ inline_keyboard: keyboardsMonth }) };
  }
};
