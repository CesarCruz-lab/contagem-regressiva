const mainElement = document.querySelector('main')
const nextYearElement = document.querySelector('.next-year')
const timerElement = document.querySelector('.timer')

// utils

function camelCaseToKebabCase(camelCase='') {
  const camelCaseAsArray = camelCase.split('');

  const kebabCase  = camelCaseAsArray.map(str => {
    if (str === str.toUpperCase()) return `-${str.toLowerCase()}`
    return str
  }).join('')

  return kebabCase
}

function css(style={}) {
  const styleAsArray = Object.entries(style)
  let styles = ''

  styleAsArray.forEach(([key, value]) => {
    styles += `${camelCaseToKebabCase(key)}: ${value};`
  })

  return styles
}

function getRandomNumberInRange({ min, max }={min: 0, max: 10}) {
  return Math.round(Math.random() * (max - min)) + min
}

const getUnit = (unit, pad) => unit < 10 ? String(unit).padStart(pad, '0') : unit

// stars

function generateStars(count=20) {
  const starList = []

  for (let i = 0; i < count; i++) {
    const star = document.createElement('span')
    const size = getRandomNumberInRange({ min: 1, max: 3 })
    const positionTop = getRandomNumberInRange({ min: 1, max: 99 })
    const positionLeft = getRandomNumberInRange({ min: 1, max: 99 })
    const duration = getRandomNumberInRange({ min: 1000, max: 2000 })

    star.classList.add('star')
    star.style = css({
      position: 'absolute',
      zIndex: 1,
      top: `${positionTop}%`,
      left: `${positionLeft}%`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: `100%`,
      backgroundColor: '#fff',
      animationDuration: `${duration}ms`
    })

    starList.push(star);
  }

  return starList;
}

function addStarsToThePage() {
  const stars = generateStars(window.innerWidth / 4)

  stars.forEach(star => {
    mainElement.appendChild(star)
  })
}

// timer

const timer = {
  current: null,
  next: null,
  difference: 0,
  count: {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  },
  loop: false,
}

function updateTimer() {
  timer.current = new Date()
  timer.next = new Date(timer.current.getFullYear() + 1, 0, 1)
  timer.difference = timer.next.getTime() - timer.current.getTime()
  timer.loop = (Math.floor(timer.difference / 1000) > 0)

  timer.count = {
    seconds: Math.floor(timer.difference / 1000 % 60),
    minutes: Math.floor(timer.difference / 1000 / 60 % 60),
    hours: Math.floor(timer.difference / 1000 / 60 / 60 % 24),
    days: Math.floor(timer.difference / 1000 / 60 / 60 / 24),
  }
}

function getRenderTemplate() {
  return () => {
    const template = `
      <div>
        <span class="count">${getUnit(timer.count.days, 3)}</span>
        <span class="unit">Days</span>
      </div>
      <div>
        <span class="count">${getUnit(timer.count.hours, 2)}</span>
        <span class="unit">Hours</span>
      </div>
      <div>
        <span class="count">${getUnit(timer.count.minutes, 2)}</span>
        <span class="unit">Minutes</span>
      </div>
      <div>
        <span class="count">${getUnit(timer.count.seconds, 2)}</span>
        <span class="unit">Seconds</span>
      </div>
    `
    timerElement.innerHTML = template
  }
}

function getCountInterval() {
  return (cb=() => {}, ms=0) => {
    timer.loop = true

    const interval = setInterval(() => {
      updateTimer()
      cb()
  
      if (!timer.loop) {
        clearInterval(interval)
      }
    }, ms)
  }
}

function startCounter() {
  const countInterval = getCountInterval()
  const renderTemplate = getRenderTemplate()

  countInterval(renderTemplate, 1000)
}

function init() {
  addStarsToThePage()
  startCounter()
}

init()
