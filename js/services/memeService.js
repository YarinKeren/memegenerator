'use strict'

let gImgs = []

const gStickers = [
  { url: 'styles/stickers/1.png' },
  { url: 'styles/stickers/2.png' },
  { url: 'styles/stickers/3.png' },
  { url: 'styles/stickers/4.png' },
  { url: 'styles/stickers/5.png' },
]

let gMeme = {}

const SAVED_MEMES = 'memesDB'

function getMeme() {
  return gMeme
}

function getLines() {
  return gMeme.lines
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

function getSelectedLineIdx() {
  return gMeme.selectedLineIdx
}

function getSelectedSticker(idx) {
  return gStickers[idx]
}

function getImgUrlByIdx(imgIdx) {
  if (gImgs[imgIdx] && gImgs[imgIdx].url) return gImgs[imgIdx].url
  else return `meme-imgs/meme-imgs/${getRandomInt(1, 19)}.jpg`
}

function getImgByIdx(idx) {
  return gImgs.find((img, id) => idx === id)
}

function setLineTxt(newText) {
  const line = getSelectedLine()
  if (line) line.txt = newText
  else gMeme.lines[0].txt += newText
}

function setTextColor(color) {
  const line = getSelectedLine()
  line.color = color
}

function setFontSize(diff) {
  const line = getSelectedLine()
  line.size += diff
}

function setLineFont(font) {
  const line = getSelectedLine()
  line.font = font
}

function _getImgIdx(imgId) {
  return gImgs.findIndex(img => img.id === imgId)
}

function setSavedImg(meme) {
  const id = makeId()

  gImgs.push({
    id: id,
    url: meme.url,
    keywords: ['idiot', 'funny'],
  })

  gMeme = meme

  gMeme.selectedImgIdx = _getImgIdx(id)
}

function setImg(elImg, imgUrl) {
  let imgIdx
  if (elImg.dataset) imgIdx = _getImgIdx(elImg.dataset.idx)
  else imgIdx = elImg
  if (imgIdx === -1) imgIdx = elImg.dataset.idx

  gMeme = {
    url: imgUrl,
    selectedImgIdx: imgIdx,
    selectedLineIdx: 0,
    lines: [
      {
        txt: 'Canvas is shit',
        size: 30,
        color: 'white',
        align: 'center',
        font: 'Impact',
        underline: false,
      },
      {
        txt: 'I want a CR',
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

function addStickerLine(newStickerLine) {
  gMeme.lines.push(newStickerLine)
}

function switchLineIdx() {
  if (gMeme.selectedLineIdx === gMeme.lines.length - 1)
    gMeme.selectedLineIdx = 0
  else gMeme.selectedLineIdx++
}

function updateSelectedLine() {
  gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function deleteLine() {
  gMeme.lines = gMeme.lines.filter(
    (_, index) => index !== gMeme.selectedLineIdx
  )
  if (gMeme.selectedLineIdx !== 0) gMeme.selectedLineIdx--
}

function setAlignment(alignment) {
  const line = getSelectedLine()
  line.align = alignment
}

function saveMemeToStorage(elCanvas) {
  gMeme.fullData = elCanvas.toDataURL('image/jpeg')
  let savedMemes = loadFromStorage(SAVED_MEMES)
  if (!savedMemes || !savedMemes.length) savedMemes = [gMeme]
  else savedMemes.push(gMeme)
  saveToStorage(SAVED_MEMES, savedMemes)
}

function getSavedMemes() {
  return loadFromStorage(SAVED_MEMES)
}
