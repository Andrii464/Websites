'use strict';
    var slideShow = (function () {
      return function (selector, config) {
        var
          _slider = document.querySelector(selector), // основний елемент блоку
          _sliderContainer = _slider.querySelector('.slider__items'), // контейнер для .slider-item
          _sliderItems = _slider.querySelectorAll('.slider__item'), // коллекція .slider-item
          _sliderControls = _slider.querySelectorAll('.slider__control'), // елементи управління
          _currentPosition = 0, // позиція лівого активного елемента
          _transformValue = 0, // значення транфсофрмації .slider_wrapper
          _transformStep = 100, // величина кроку (для трансформации)
          _itemsArray = [], // массив елементів
          _timerId,
          _indicatorItems,
          _indicatorIndex = 0,
          _indicatorIndexMax = _sliderItems.length - 1,
          _stepTouch = 50,
          _config = {
            isAutoplay: false, // автоматична зміна слайдів
            directionAutoplay: 'next', // напрямок зміни слайдів
            delayAutoplay: 5000, // інтервал між автоматичною зміною слайдів
            isPauseOnHover: true // установка  паузи при піднесенні курсора до слайдеру
          };

        // настройка конфігурації слайдера в залежності від отриманих  ключів
        for (var key in config) {
          if (key in _config) {
            _config[key] = config[key];
          }
        }

        // наповнення массива _itemsArray
        for (var i = 0, length = _sliderItems.length; i < length; i++) {
          _itemsArray.push({ item: _sliderItems[i], position: i, transform: 0 });
        }

        // змінна position вміщує методи за допомогою яких можно получити мин и макс індекс елемента, а також відповідному цьому індексу позицію
        var position = {
          getItemIndex: function (mode) {
            var index = 0;
            for (var i = 0, length = _itemsArray.length; i < length; i++) {
              if ((_itemsArray[i].position < _itemsArray[index].position && mode === 'min') || (_itemsArray[i].position > _itemsArray[index].position && mode === 'max')) {
                index = i;
              }
            }
            return index;
          },
          getItemPosition: function (mode) {
            return _itemsArray[position.getItemIndex(mode)].position;
          }
        };

        // функція, виконуюча зміну напрямку слайдів
        var _move = function (direction) {
          var nextItem, currentIndicator = _indicatorIndex;;
          if (direction === 'next') {
            _currentPosition++;
            if (_currentPosition > position.getItemPosition('max')) {
              nextItem = position.getItemIndex('min');
              _itemsArray[nextItem].position = position.getItemPosition('max') + 1;
              _itemsArray[nextItem].transform += _itemsArray.length * 100;
              _itemsArray[nextItem].item.style.transform = 'translateX(' + _itemsArray[nextItem].transform + '%)';
            }
            _transformValue -= _transformStep;
            _indicatorIndex = _indicatorIndex + 1;
            if (_indicatorIndex > _indicatorIndexMax) {
              _indicatorIndex = 0;
            }
          } else {
            _currentPosition--;
            if (_currentPosition < position.getItemPosition('min')) {
              nextItem = position.getItemIndex('max');
              _itemsArray[nextItem].position = position.getItemPosition('min') - 1;
              _itemsArray[nextItem].transform -= _itemsArray.length * 100;
              _itemsArray[nextItem].item.style.transform = 'translateX(' + _itemsArray[nextItem].transform + '%)';
            }
            _transformValue += _transformStep;
            _indicatorIndex = _indicatorIndex - 1;
            if (_indicatorIndex < 0) {
              _indicatorIndex = _indicatorIndexMax;
            }
          }
          _sliderContainer.style.transform = 'translateX(' + _transformValue + '%)';
          _indicatorItems[currentIndicator].classList.remove('active');
          _indicatorItems[_indicatorIndex].classList.add('active');
        };

        // функція, здійснює перехід до слайду по його порядковому номеру
        var _moveTo = function (index) {
          var i = 0, direction = (index > _indicatorIndex) ? 'next' : 'prev';
          while (index !== _indicatorIndex && i <= _indicatorIndexMax) {
            _move(direction);
            i++;
          }
        };

        // функція для запуску автоматичної зміни слайдів через періоди часу
        var _startAutoplay = function () {
          if (!_config.isAutoplay) {
            return;
          }
          _stopAutoplay();
          _timerId = setInterval(function () {
            _move(_config.directionAutoplay);
          }, _config.delayAutoplay);
        };

        // функція, яка відключає автоматичну зміну слайдів
        var _stopAutoplay = function () {
          clearInterval(_timerId);
        };

        // функція, яка добавляє індикатори до слайдерів
        var _addIndicators = function () {
          var indicatorsContainer = document.createElement('ol');
          indicatorsContainer.classList.add('slider__indicators');
          for (var i = 0, length = _sliderItems.length; i < length; i++) {
            var sliderIndicatorsItem = document.createElement('li');
            if (i === 0) {
              sliderIndicatorsItem.classList.add('active');
            }
            sliderIndicatorsItem.setAttribute("data-slide-to", i);
            indicatorsContainer.appendChild(sliderIndicatorsItem);
          }
          _slider.appendChild(indicatorsContainer);
          _indicatorItems = _slider.querySelectorAll('.slider__indicators > li')
        };

        var _isTouchDevice = function () {
          return !!('ontouchstart' in window || navigator.maxTouchPoints);
        };

        // функція, яка здійснює установку обработчика для подій
        var _setUpListeners = function () {
          var _startX = 0;
          if (_isTouchDevice()) {
            _slider.addEventListener('touchstart', function (e) {
              _startX = e.changedTouches[0].clientX;
              _startAutoplay();
            });
            _slider.addEventListener('touchend', function (e) {
              var
                _endX = e.changedTouches[0].clientX,
                _deltaX = _endX - _startX;
              if (_deltaX > _stepTouch) {
                _move('prev');
              } else if (_deltaX < -_stepTouch) {
                _move('next');
              }
              _startAutoplay();
            });
          } else {
            for (var i = 0, length = _sliderControls.length; i < length; i++) {
              _sliderControls[i].classList.add('slider__control_show');
            }
          }
          _slider.addEventListener('click', function (e) {
            if (e.target.classList.contains('slider__control')) {
              e.preventDefault();
              _move(e.target.classList.contains('slider__control_next') ? 'next' : 'prev');
              _startAutoplay();
            } else if (e.target.getAttribute('data-slide-to')) {
              e.preventDefault();
              _moveTo(parseInt(e.target.getAttribute('data-slide-to')));
              _startAutoplay();
            }
          });
          document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === "hidden") {
              _stopAutoplay();
            } else {
              _startAutoplay();
            }
          }, false);
          if (_config.isPauseOnHover && _config.isAutoplay) {
            _slider.addEventListener('mouseenter', function () {
              _stopAutoplay();
            });
            _slider.addEventListener('mouseleave', function () {
              _startAutoplay();
            });
          }
        };

        // добавляемо індикатори до слайдера
        _addIndicators();
        // установлюємо обработчик подій
        _setUpListeners();
        // запускаємо автоматичну зміну слайдів, якщо установлений відповідний ключ
        _startAutoplay();

        return {
          // метод слайдера для переходу до наступного  слайда
          next: function () {
            _move('next');
          },
          // метод слайдера для переходу до попереднього  слайда         
          left: function () {
            _move('prev');
          },
          // метод який відключає авто зміну
          stop: function () {
            _config.isAutoplay = false;
            _stopAutoplay();
          },
          // метод який запускає авто
          cycle: function () {
            _config.isAutoplay = true;
            _startAutoplay();
          }
        }
      }
    }());

    slideShow('.slider', {
      isAutoplay: true
    });