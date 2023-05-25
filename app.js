const express = require('express');
const app = express();
const morgan = require("morgan");
const cors = require('cors');
const Blog = require('./models/blog');
// const middleware = require("./utils/middleware");
const config = require("./utils/config");
const logger = require("./utils/logger");
const blogsRouter = require("./controllers/blog");
const usersRouter = require('./controllers/users');





const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(cors())
app.use(requestLogger)
app.use('/api/bloglist', blogsRouter)
app.use('/api/users', usersRouter)






// let Bloglist = [
//     {
//       id: 1,
//       title: "Saving the whales",
//       author: "James Macvoy",
//       URL: "https://blog.padi.com/save-the-whales-save-the-world/",
//       likes: 37
//     },
//     {
//         id: 2,
//         title: "Magic card gatherings",
//         author: "Peter dunking",
//         URL: "https://magic.wizards.com/en/news/feature/march-of-the-machine-the-aftermath-release-notes",
//         likes: 20
//       },
//       {
//         id: 3,
//         title: "drinking to much coffee",
//         author: "Tom winkler",
//         URL: "https://www.healthline.com/nutrition/caffeine-side-effects",
//         likes: 100
//       }  
//   ]

  app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/bloglist', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.get('/api/bloglist/:id', (request, response, next) => {
  Blog.findById(request.params.id)
      .then((blog) => {
        if (blog) {
          response.json(blog);
        } else {
          response.status(404).end();
        }
      })
  
      .catch((error) => next(error));
  })

  app.delete('/api/bloglist/:id', (request, response) => {
    Blog.findByIdAndRemove(request.params.id)
      .then(()=>{
        response.status(204).end();
      })

      .catch((error) => error)
  });

  // const generateId = () => {
  //   const maxId = Bloglist.length > 0
  //   ? Math.max(...Bloglist.map(n => n.id)) 
  //   : 0
  //   return maxId + 1
  // }

  app.post('/api/bloglist', (request, response) => {
    const body = request.body

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
})


    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
  })


  app.put('/:id', (request, response, next) =>{
    const body = request.body

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
  })

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  .then(updatedBlog => {
    response.json(updatedBlog)
  })
  .catch(error => next(error))

})

  app.use(unknownEndpoint)



  module.exports= app;
