'use strict'

const gImgsGallery = [
  {
    id: '1',
    url: 'meme-imgs/meme-imgs/1.jpg',
    keywords: ['blonde', 'idiot'],
  },
  {
    id: '2',
    url: 'meme-imgs/meme-imgs/2.jpg',
    keywords: ['blonde', 'idiot'],
  },
  {
    id: '3',
    url: 'meme-imgs/meme-imgs/3.jpg',
    keywords: ['puppy', 'cute'],
  },
  {
    id: '4',
    url: 'meme-imgs/meme-imgs/4.jpg',
    keywords: ['cute', 'puppy'],
  },
  {
    id: '5',
    url: 'meme-imgs/meme-imgs/5.jpg',
    keywords: ['baby', 'yes'],
  },
  {
    id: '6',
    url: 'meme-imgs/meme-imgs/6.jpg',
    keywords: ['cute', 'cat'],
  },
  {
    id: '7',
    url: 'meme-imgs/meme-imgs/7.jpg',
    keywords: ['interesting', 'funny'],
  },
  {
    id: '8',
    url: 'meme-imgs/meme-imgs/8.jpg',
    keywords: ['baby', 'laugh'],
  },
  {
    id: '9',
    url: 'meme-imgs/meme-imgs/9.jpg',
    keywords: ['weird', 'professor'],
  },
  {
    id: '10',
    url: 'meme-imgs/meme-imgs/10.jpg',
    keywords: ['laugh', 'idiot', 'quotes'],
  },
  {
    id: '11',
    url: 'meme-imgs/meme-imgs/11.jpg',
    keywords: ['baby', 'black'],
  },
  {
    id: '12',
    url: 'meme-imgs/meme-imgs/12.jpg',
    keywords: ['you', 'israeli'],
  },
  {
    id: '13',
    url: 'meme-imgs/meme-imgs/13.jpg',
    keywords: ['idiot', 'blonde'],
  },
  {
    id: '14',
    url: 'meme-imgs/meme-imgs/14.jpg',
    keywords: ['black', 'baby'],
  },
  {
    id: '15',
    url: 'meme-imgs/meme-imgs/15.jpg',
    keywords: ['dog', 'puppy'],
  },
  {
    id: '16',
    url: 'meme-imgs/meme-imgs/16.jpg',
    keywords: ['funny', 'laugh', 'black'],
  },
  {
    id: '17',
    url: 'meme-imgs/meme-imgs/17.jpg',
    keywords: ['black', 'gay'],
  },
  {
    id: '18',
    url: 'meme-imgs/meme-imgs/18.jpg',
    keywords: ['cheers', 'funny'],
  },
  {
    id: '19',
    url: 'meme-imgs/meme-imgs/19.jpg',
    keywords: ['idiot', 'funny'],
  },
  {
    id: '20',
    url: 'meme-imgs/meme-imgs/20.jpg',
    keywords: ['black', 'weird'],
  },
  {
    id: '21',
    url: 'meme-imgs/meme-imgs/21.jpg',
    keywords: ['lotr', 'ginger'],
  },
  {
    id: '22',
    url: 'meme-imgs/meme-imgs/22.jpg',
    keywords: ['black', 'woman'],
  },
  {
    id: '23',
    url: 'meme-imgs/meme-imgs/23.jpg',
    keywords: ['laugh', 'funny'],
  },
  {
    id: '24',
    url: 'meme-imgs/meme-imgs/24.jpg',
    keywords: ['dictator', 'gay'],
  },
  {
    id: '25',
    url: 'meme-imgs/meme-imgs/25.jpg',
    keywords: ['toy story', 'look'],
  },
]
let gKeywordSearchCountMap = {
  Puppy: 12,
  Baby: 16,
  Idiot: 12,
  Laugh: 8,
  Dictator: 24,
  Black: 12,
}
let gFilterBy = ''

function getImgs() {
  if (gFilterBy === '') {
    return gImgsGallery
  }

  return gImgsGallery.filter(img =>
    img.keywords.some(keyword => keyword.includes(gFilterBy))
  )
}

function getSearchCountMap() {
  return gKeywordSearchCountMap
}

function setFilterBy(filterBy) {
  gFilterBy = filterBy
}
