let gImgs = [{ id: 1, url: 'img/1.jpg', keywords: ['funny', 'cat'] }]
let gMeme = {
  selectedImgIdx: 5,
  selectedLineIdx: 0,
  lines: [
    {
      txt: 'I sometimes eat Falafel',
      size: 30,
      color: 'black',
    },
    {
      txt: 'I dont use jQuery',
      size: 30,
      color: 'black',
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
