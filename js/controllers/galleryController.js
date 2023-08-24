'use strict'

function renderGallery() {
  const elGallery = getEl('.gallery-body')
  const imgs = getImgs()
  let galleryHTML = ''

  imgs.forEach((img, idx) => {
    galleryHTML += `<img src="${img.url}" alt="" onclick="onImgSelect(this, '${
      img.url
    }')" data-keywords="${img.keywords}" data-idx="${idx + 1}">`
  })

  elGallery.innerHTML = galleryHTML

  setImgs(imgs)
  renderKeywordsDataList()
}

function renderKeywordsDataList() {
  const uniqueKeywords = gImgsGallery.reduce((keywords, img) => {
    img.keywords.forEach((keyword) => {
      if (!keywords.includes(keyword)) {
        keywords.push(keyword)
      }
    })
    return keywords
  }, [])

  const elKeywordsList = document.querySelector('.keywordsList')
  elKeywordsList.innerHTML = uniqueKeywords
    .map((keyword) => `<option value="${keyword}"></option>`)
    .join('')
}

function onImgSelect(elImg, imgUrl) {
  setImg(elImg, imgUrl)
  onMemeInit()
}

function onFlexible() {
  setImg(getRandomInt(1, 19))
  onMemeInit()
}

function onSetFilterBy({ value }, key) {
  if (value !== undefined) setFilterBy(value)
  else setFilterBy(key)
  renderGallery()
}

function renderKeywordsSearch() {
  const elSearchContainer = getEl('.search-words')
  const searchMap = getSearchCountMap()
  let strHtml = ''

  for (const key in searchMap) {
    const value = searchMap[key]
    strHtml += `<span style="font-size: ${value}px" onclick="onSetFilterBy(this, '${key.toLowerCase()}'); increaseFont(this)">${key}</span>`
  }

  elSearchContainer.innerHTML = strHtml
}

function increaseFont(elSpan) {
  const currentFontSize = parseInt(elSpan.style.fontSize)
  const newFontSize = currentFontSize + 1
  elSpan.style.fontSize = `${newFontSize}px`
}
