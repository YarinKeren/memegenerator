let gImgs = [{ id: 1, url: 'img/1.jpg', keywords: ['funny', 'cat'] }]
let gMeme = {
  selectedImgIdx: 5,
  selectedLineIdx: 0,
  lines: [
    {
      txt: 'I dont use jQuery',
      size: 30,
      color: 'white',
    },
    {
      txt: 'I dont use jQuery',
      size: 30,
      color: 'white',
    },
  ],
}
let gKeywordSearchCountMap = { funny: 12, cat: 16, baby: 2 }

function getMeme() {
  return gMeme
}

function getImgUrlByIdx(imgIdx) {
  return gImgs[imgIdx].url
}

function setLineTxt(text) {
  gMeme.lines[gMeme.selectedLineIdx].txt = text
}

function setTextColor(color) {
  gMeme.lines[gMeme.selectedLineIdx].color = color
}

function setFontSize(diff) {
  console.log(diff)
  gMeme.lines[gMeme.selectedLineIdx].size += diff
}

function _getImgIdx(imgId) {
  return gImgs.findIndex((img) => img.id === imgId)
}

function setImg(imagePath) {
  const id = makeId()

  gImgs.push({
    id: id,
    url: imagePath,
    keywords: ['cute', 'puppy'],
  })

  gMeme.selectedImgIdx = _getImgIdx(id)
}

function addLine() {
  gMeme.lines.push({
    txt: '',
    size: 30,
    color: 'black',
  })
  if (gMeme.selectedLineIdx <= 1) gMeme.selectedLineIdx = 2
  else gMeme.selectedLineIdx++
}

function switchLineIdx() {
  if (gMeme.selectedLineIdx == gMeme.lines.length - 1) gMeme.selectedLineIdx = 0
  else gMeme.selectedLineIdx++
}
