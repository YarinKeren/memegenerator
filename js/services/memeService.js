let gImgs = [{ id: 1, url: 'img/1.jpg', keywords: ['funny', 'cat'] }]
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
let gKeywordSearchCountMap = { funny: 12, cat: 16, baby: 2 }
const SAVED_MEMES = 'memesDB'

function getMeme() {
  return gMeme
}

function getSelectedLine() {
  return gMeme.lines[gMeme.selectedLineIdx]
}

function getImgUrlByIdx(imgIdx) {
  return gImgs[imgIdx].url
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

function setImg(imagePath) {
  const id = makeId()

  gImgs.push({
    id: id,
    url: imagePath,
    keywords: ['cute', 'puppy'],
  })

  gMeme = {
    imgURL: null,
    selectedImgIdx: _getImgIdx(id),
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
