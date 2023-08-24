const gImgsGallery = [
  {
    id: '1',
    url: 'meme-imgs/meme-imgs/1.jpg',
    keywords: ['blonde', 'idiot'],
  },
  {
    id: '2',
    url: 'meme-imgs/meme-imgs/2.jpg',
    keywords: ['cute', 'puppy'],
  },
  {
    id: '3',
    url: 'meme-imgs/meme-imgs/3.jpg',
    keywords: ['baby', 'puppy', 'cute'],
  },
  {
    id: '4',
    url: 'meme-imgs/meme-imgs/4.jpg',
    keywords: ['cute', 'cat'],
  },
  {
    id: '5',
    url: 'meme-imgs/meme-imgs/5.jpg',
    keywords: ['baby', 'yes'],
  },
  {
    id: '6',
    url: 'meme-imgs/meme-imgs/6.jpg',
    keywords: ['weird', 'professor'],
  },
  {
    id: '7',
    url: 'meme-imgs/meme-imgs/7.jpg',
    keywords: ['baby', 'wow'],
  },
  {
    id: '8',
    url: 'meme-imgs/meme-imgs/8.jpg',
    keywords: ['interesting', 'funny'],
  },
  {
    id: '9',
    url: 'meme-imgs/meme-imgs/9.jpg',
    keywords: ['baby', 'laugh'],
  },
  {
    id: '10',
    url: 'meme-imgs/meme-imgs/10.jpg',
    keywords: ['laugh', 'idiot', 'black'],
  },
  {
    id: '11',
    url: 'meme-imgs/meme-imgs/11.jpg',
    keywords: ['gay', 'black'],
  },
  {
    id: '12',
    url: 'meme-imgs/meme-imgs/12.jpg',
    keywords: ['you', 'israeli'],
  },
  {
    id: '13',
    url: 'meme-imgs/meme-imgs/13.jpg',
    keywords: ['cheers', 'fancy'],
  },
  {
    id: '14',
    url: 'meme-imgs/meme-imgs/14.jpg',
    keywords: ['black', 'sunglasses'],
  },
  {
    id: '15',
    url: 'meme-imgs/meme-imgs/15.jpg',
    keywords: ['lotr', 'dont'],
  },
  {
    id: '16',
    url: 'meme-imgs/meme-imgs/16.jpg',
    keywords: ['funny', 'laugh'],
  },
  {
    id: '17',
    url: 'meme-imgs/meme-imgs/17.jpg',
    keywords: ['peace', 'dictator'],
  },
  {
    id: '18',
    url: 'meme-imgs/meme-imgs/18.jpg',
    keywords: ['look', 'toy story'],
  },
]
let gFilterBy = ''

function getImgs() {
  if (gFilterBy === '') return gImgsGallery

  return gImgsGallery.filter((img) => {
    return img.keywords.some((keyword) => keyword.includes(gFilterBy))
  })
}

function setFilterBy(filterBy) {
  gFilterBy = filterBy
}

function getFilter() {
  return gFilterBy
}
