'use strict'

const gTrans = {
  title: {
    en: 'Meme-Generator',
    he: 'מחולל פירושונים',
  },
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
  search: {
    en: 'Search..',
    he: 'חיפוש..',
  },
  'flexible-btn': {
    en: "I'm Flexible",
    he: 'אני גמיש !',
  },
  'editor-share-btn': {
    en: 'Share',
    he: 'שתף',
  },
  'editor-download-btn': {
    en: 'Download',
    he: 'הורדה',
  },
  'editor-save-btn': {
    en: 'Save',
    he: 'שמור',
  },
  'editor-facebook-btn': {
    en: 'Facebook',
    he: 'פייסבוק',
  },
  'editor-twitter-btn': {
    en: '(Twitter)',
    he: '(טוויטר)',
  },
  puppy: {
    en: 'Puppy',
    he: 'כלבלב',
  },
  baby: {
    en: 'Baby',
    he: 'תינוק',
  },
  idiot: {
    en: 'idiot',
    he: 'טמבל',
  },
  laugh: {
    en: 'Laugh',
    he: 'צוחק',
  },
  dictator: {
    en: 'Dictator',
    he: 'דיקטטור',
  },
  black: {
    en: 'Black',
    he: 'כהה עור',
  },
}

var gCurrLang = 'en'

function setLang(lang) {
  gCurrLang = lang
}

function doTrans() {
  const els = document.getEls('[data-trans]')
  els.forEach(el => {
    const transKey = el.dataset.trans
    const transText = getTranslation(transKey)
    if (el.placeholder) el.placeholder = transText
    else el.innerText = transText
  })
}

function getTrans(transKey) {
  const transMap = gTrans[transKey]
  if (!transMap) return 'UNKNOWN'
  const transText = transMap[gCurrLang] || transMap.en
  return transText
}
