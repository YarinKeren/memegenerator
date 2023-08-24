'use strict'

let gImgs = []

const gStickers = [
  { url: 'styles/stickers/1.png' },
  { url: 'styles/stickers/2.png' },
  { url: 'styles/stickers/3.png' },
  { url: 'styles/stickers/4.png' },
  { url: 'styles/stickers/5.png' },
]

let gMeme = {
  imgURL: null,
  selectedImgIdx: 5,
  selectedLineIdx: 0,
  lines: [
    {
      txt: 'I dont use jQuery',
      size: 30,
      color: 'white',
      align: 'center',
      font: 'Impact',
      underline: false,
    },
    {
      txt: 'use JS',
      size: 30,
      color: 'white',
      align: 'center',
      font: 'Impact',
      underline: false,
    },
  ],
}

const SAVED_MEMES = 'memesDB'

function getMeme() {
  return gMeme
}

function getStickers() {
  return gStickers
}

function setImgs(imgs) {
  gImgs = imgs
}

function getSelectedLine() {
  return gMeme.lines[gMeme.selectedLineIdx]
}

function getImgUrlByIdx(imgIdx) {
  return gImgs[imgIdx].url
}

function getImgByIdx(idx) {
  return gImgs.find((img, id) => idx === id)
}

function setLineTxt(text) {
  if (gMeme.lines[gMeme.selectedLineIdx])
    gMeme.lines[gMeme.selectedLineIdx].txt = text
  else gMeme.lines[0].txt += text
}

function setTextColor(color) {
  gMeme.lines[gMeme.selectedLineIdx].color = color
}

function setFontSize(diff) {
  console.log(diff)
  gMeme.lines[gMeme.selectedLineIdx].size += diff
}

function setLineFont(font) {
  const line = getSelectedLine()
  line.font = font
}

function _getImgIdx(imgId) {
  return gImgs.findIndex((img) => img.id === imgId)
}

function setSavedImg(imagePath, meme) {
  const id = makeId()

  gImgs.push({
    id: id,
    url: imagePath,
    keywords: ['cute', 'puppy'],
  })

  gMeme = meme

  gMeme.selectedImgIdx = _getImgIdx(id)
}

function setImg(elImg, imgUrl) {
  let imgIdx
  if (elImg.dataset) imgIdx = _getImgIdx(elImg.dataset.idx)
  else imgIdx = elImg
  gMeme = {
    imgURL: imgUrl,
    selectedImgIdx: imgIdx,
    selectedLineIdx: 0,
    lines: [
      {
        txt: 'I dont use jQuery',
        size: 30,
        color: 'white',
        align: 'center',
        font: 'Impact',
        underline: false,
      },
      {
        txt: 'use JS',
        size: 30,
        color: 'white',
        align: 'center',
        font: 'Impact',
        underline: false,
      },
    ],
  }
}

function addLine() {
  gMeme.lines.push({
    txt: '',
    size: 30,
    color: 'white',
    align: 'center',
    font: 'Impact',
    underline: false,
  })
  if (gMeme.selectedLineIdx <= 1) gMeme.selectedLineIdx = 2
  else gMeme.selectedLineIdx++
}

function switchLineIdx() {
  if (gMeme.selectedLineIdx == gMeme.lines.length - 1) gMeme.selectedLineIdx = 0
  else gMeme.selectedLineIdx++
}

function deleteLine() {
  gMeme.lines = gMeme.lines.filter(
    (line, index) => index !== gMeme.selectedLineIdx
  )
  gMeme.selectedLineIdx--
}

function setAlignment(alignment) {
  gMeme.lines[gMeme.selectedLineIdx].align = alignment
}

function saveMemeToStorage() {
  let savedMemes = loadFromStorage(SAVED_MEMES)
  if (!savedMemes || !savedMemes.length) savedMemes = [gMeme]
  else savedMemes.push(gMeme)
  saveToStorage(SAVED_MEMES, savedMemes)
}

function getSavedMemes() {
  return loadFromStorage(SAVED_MEMES)
}
