'use strict'

function renderGallery() {
  const imgs = getImgs()
  let galleryHTML = ''

  imgs.forEach((img, idx) => {
    galleryHTML += `<img src="${img.url}"
    onclick="onImgSelect(this, '${img.url}')"
    data-keywords="${img.keywords}"
    data-idx="${idx + 1}"
    >`
  })

  setElHtml('.gallery-body', galleryHTML)
  setImgs(imgs)
  renderFilterDataList()
}

function onImgSelect(elImg, imgUrl) {
  setImg(elImg, imgUrl)
  moveToEditor()
  onMemeInit()
}

function renderFilterDataList() {
  const uniqueKeywords = gImgsGallery.reduce((keywords, img) => {
    img.keywords.forEach(keyword => {
      if (!keywords.includes(keyword)) {
        keywords.push(keyword)
      }
    })
    return keywords
  }, [])

  const strHtml = uniqueKeywords
    .map(keyword => `<option value="${keyword}"></option>`)
    .join('')

  setElHtml('.keywordsList', strHtml)
}

function onFlexible() {
  setImg(getRandomInt(1, 19))
  moveToEditor()
  onMemeInit()
}

function onSetFilterBy({ value }, key) {
  if (value !== undefined) setFilterBy(value)
  else setFilterBy(key)
  renderGallery()
}

function renderKeywordsSearch() {
  const searchMap = getSearchCountMap()
  let strHtml = ''

  for (const key in searchMap) {
    const value = searchMap[key]
    strHtml += `<span
                  style="font-size: ${value}px"
                  data-trans="${key.toLowerCase()}"
                  onclick="
                  onSetFilterBy(this, '${key.toLowerCase()}');
                  increaseFont(this)">
                  ${key}
                  </span>`
  }

  setElHtml('.search-words', strHtml)
}

function increaseFont(elSpan) {
  const currFontSize = parseInt(elSpan.style.fontSize)
  elSpan.style.fontSize = `${currFontSize + 1}px`
}
