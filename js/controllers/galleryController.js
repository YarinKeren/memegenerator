function renderGallery() {
  const elGallery = getEl('.gallery-body')
  const imgs = getImgs()
  const filter = getFilter()
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
  setImg(`meme-imgs/meme-imgs/${getRandomInt(1, 19)}.jpg`)
  onMemeInit()
}

function onSetFilterBy({ value }) {
  setFilterBy(value)
  renderGallery()
}
