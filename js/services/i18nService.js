'use strict'

const gTrans = {
  logo: {
    en: 'Meme-GeneratØr',
    he: 'מחולל פירושונים',
  },
  gallery: {
    en: 'Gallery',
    he: 'גלריה',
  },
  memes: {
    en: 'Memes',
    he: 'פירושונים',
  },
  about: {
    en: 'About',
    he: 'אודות',
  },
  price: {
    en: 'Price',
    he: 'מחיר',
  },
  'expensive-books': {
    en: 'Expensive',
    he: 'יקר',
  },
  'moderate-books': {
    en: 'Moderate',
    he: 'סביר',
  },
  'cheap-books': {
    en: 'Cheap',
    he: 'זול',
  },
  'book-id': {
    en: 'ID',
    he: 'מק"ט',
  },
  'book-title': {
    en: 'Title',
    he: 'כותרת',
  },
  'book-price': {
    en: 'Price',
    he: 'מחיר',
  },
  'book-actions': {
    en: 'Actions',
    he: 'פעולות',
  },
  'filter-placeholder': {
    en: 'Search...',
    he: 'חפש...',
  },
}

var gCurrLang = 'en'

function setLang(lang) {
  gCurrLang = lang
}

function doTrans() {
  const els = document.querySelectorAll('[data-trans]')
  els.forEach((el) => {
    const transKey = el.dataset.trans
    const transTxt = getTrans(transKey)
    if (el.placeholder) el.placeholder = transTxt
    else el.innerText = transTxt
  })
}

function getTrans(transKey) {
  const transMap = gTrans[transKey] // {'en':,'he':}
  if (!transMap) return 'UNKNOWN'
  let transTxt = transMap[gCurrLang]
  if (!transTxt) transTxt = transMap.en
  return transTxt
}
