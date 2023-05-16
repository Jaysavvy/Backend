
const http = require('http')

const express = require('express');
const app = express();

app.use(express.json())



let Bloglist = [
    {
      id: 1,
      title: "Saving the whales",
      author: "James Macvoy",
      URL: "https://blog.padi.com/save-the-whales-save-the-world/",
      likes: 37
    },
    {
        id: 2,
        title: "Magic card gatherings",
        author: "Peter dunking",
        URL: "https://magic.wizards.com/en/news/feature/march-of-the-machine-the-aftermath-release-notes",
        likes: 20
      },
      {
        id: 3,
        title: "drinking to much coffee",
        author: "Tom winkler",
        URL: "https://www.healthline.com/nutrition/caffeine-side-effects",
        likes: 100
      }  
  ]

  app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/bloglist', (request, response) => {
  response.json(Bloglist)
})

app.get('/api/bloglist/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const bloglist = Bloglist.find(bloglist => bloglist.id === id)
    console.log(bloglist)
    response.json(bloglist)

    if (Bloglist) {
        response.json(Bloglist)
      } else {
        response.status(404).end()
      }
  })

  app.delete('/api/bloglist/:id', (request, response) => {
    const id = Number(request.params.id)
    bloglist = Bloglist.filter(bloglist => bloglist.id !== id)
  
    response.status(204).end()
  })

  app.post('/api/bloglist', (request, response) => {
    const note = request.body
    console.log(Bloglist)
    response.json(Bloglist)
  })

  
  const PORT = 3005
  app.listen(PORT)
  console.log(`Server running on port ${PORT}`)