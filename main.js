// Этап 1. Создайте функцию, генерирующую массив парных чисел.
(() => {
  function createNumbersArray(count) {
    const arr = [];

    // Генерация парных чисел и добавление их в массив arr.
    for (let i = 1; i <= count ** 2 / 2; i++) {
      arr.push(i, i);
    }

    return arr;
  }

  // Этап 2. Создайте функцию перемешивания массива.
  function shuffle(arr) {
    let currentIndex = arr.length;

    // Перемешивание элементов массива.
    while (currentIndex !== 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);

      currentIndex--;

      [arr[randomIndex], arr[currentIndex]] = [arr[currentIndex], arr[randomIndex]];
    }

    return arr;
  }

  // Создание формы для пользовательского ввода.
  function createForm() {
    const form = document.createElement('form');
    const input = document.createElement('input');
    const buttonWrap = document.createElement('div');
    const button = document.createElement('button');
    const container = document.createElement('div');

    // Настройка элементов формы и их стилей.
    container.classList.add('container');
    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите кол-во карточек по вертикали/горизонтали';
    buttonWrap.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Начать игру';

    // Добавление элементов формы в соответствующие контейнеры.
    buttonWrap.append(button);
    form.append(input);
    form.append(buttonWrap);
    container.append(form);

    return {
      container,
      form,
      input,
      button,
    };
  }

  // Этап 3. Используйте две созданные функции для создания массива перемешанными номерами.
  function startGame(count) {
    const arr = createNumbersArray(count);
    const shufflArr = shuffle(arr);
    const container = document.createElement('div');
    const list = document.createElement('ul');
    const buttonWrap = document.createElement('div');
    const button = document.createElement('button');
    button.textContent = 'Играть снова';

    // Настройка элементов и добавление их в DOM.
    container.classList.add('container', 'field');
    list.classList.add('list-unstyled', 'row', 'list');
    buttonWrap.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary', 'btn-lg', 'rounded-pill');
    for (let i = 0; i < shufflArr.length; i++) {
      const item = document.createElement('li');
      item.classList.add('item', `col-${12 / count}`, 'card', 'card-body', 'display-3', 'text-center');
      item.append(shufflArr[i]);
      list.append(item);
    }
    buttonWrap.append(button);
    container.append(list);
    document.body.append(container);

    // Управление игровым процессом и временем.
    let timerSeconds = 60; // Начальное значение таймера (в секундах)
    const TIMER_UPDATE = 1000; // Интервал обновления таймера (в миллисекундах)

    // Создание элемента для отображения таймера и добавление его в контейнер
    const timerDisplay = document.createElement('div');
    timerDisplay.classList.add('timer');
    container.append(timerDisplay);

    // Установка интервала для обновления таймера
    const timerInterval = setInterval(() => {
      timerDisplay.textContent = `Осталось: ${timerSeconds} секунд`;

      if (timerSeconds <= 0) {
        clearInterval(timerInterval);
        alert('Игра окончена!');
        window.location.reload();
      }

      timerSeconds--;
    }, TIMER_UPDATE);

    // Длительность времени для задержки (в миллисекундах) при непарных карточках
    const TIMEOUT_DURATION = 500;
    // Инициализация массивов для сравнения и хранения найденных чисел
    let compareArr = [];
    const foundNum = [];
    // Получение списка всех элементов li и добавление обработчика событий к каждому
    const liList = document.querySelectorAll('li');
    liList.forEach((li) => {
      li.style.color = 'white';
      // Добавление обработчика события клика к каждой карточке
      li.addEventListener('click', () => {
        li.style.color = 'black';
        li.classList.add('disabled-li'); // Добавление класса для отключения обработчика событий клика
        compareArr.push(li.textContent); // Добавление значения карточки в массив для сравнения

        // Проверка, если выбраны две карточки для сравнения
        if (compareArr.length === 2) {
          if (compareArr[0] !== compareArr[1]) {
            liList.forEach((otherLi) => {
              if (otherLi.textContent === compareArr[0]) {
                otherLi.classList.remove('disabled-li'); // Удаление класса для включения обработчика событий клика
                setTimeout(() => {
                  otherLi.style.color = 'white';
                }, TIMEOUT_DURATION);
              }
              if (otherLi.textContent === compareArr[1]) {
                otherLi.classList.remove('disabled-li'); // Удаление класса для включения обработчика событий клика
                // Задержка перед возвратом цвета текста карточки в исходное состояние
                setTimeout(() => {
                  otherLi.style.color = 'white';
                }, TIMEOUT_DURATION);
              }
            });
            // Очистка массива для сравнения
            compareArr = [];
          } else {
            // Помещение найденных пар в массив найденных чисел
            liList.forEach((matchedLi) => {
              if (matchedLi.textContent === compareArr[0]) {
                foundNum.push(parseInt(matchedLi.textContent, 10));
                // Изменение стиля найденной пары карточек
                matchedLi.style.cursor = 'default';
                matchedLi.style.color = 'grey';
              }
            });
            // Очистка массива для сравнения
            compareArr = [];
            // Проверка, если все пары найдены и игра завершена
            if (JSON.stringify(foundNum.sort()) === JSON.stringify(arr.sort())) {
              // Добавление кнопки "Играть снова" и обработчика события клика
              container.append(buttonWrap);
              clearInterval(timerInterval);
              button.addEventListener('click', () => {
                window.location.reload();
              });
            }
          }
        }
      });
    });
  }
  // Создание формы и обработка события отправки формы
  const form = createForm();
  document.body.append(form.container);

  form.form.addEventListener('submit', (event) => {
    event.preventDefault();
    form.form.classList.add('d-none');
    const MIN_FIELD = 2;
    const MAX_FIELD = 10;
    const CLASSIC_FIELD = 4;
    // Получение введенного пользователем значения и начало игры
    const count = parseInt(form.input.value, 10);
    if (count >= MIN_FIELD && count <= MAX_FIELD && count % 2 === 0) {
      startGame(count);
    } else {
      alert('В поле можно ввести чётное число от 2 до 10, ваше число не соответствует данному условию, поэтому запускается стандартная игра 4х4! Удачи :)');
      startGame(CLASSIC_FIELD);
    }
  });
})();
