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
const loginRouter = require('./controllers/login')
const User = require("./models/user");
const jwt = require('jsonwebtoken');





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
app.use('/api/login', loginRouter)







  app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}
  
  app.get('/api/bloglist', async (request, response) => {
    const blogs = await Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })
  
  app.get('/api/bloglist/:id', async (request, response, next) => {
    
    const blog = await Blog.findById(request.params.id)
        .then((blog) => {
          if (blog) {
            response.json(blog);
          } else {
            response.status(404).end();
          }
        })
    
        .catch((error) => next(error));
    })
  
    app.delete('/api/bloglist/:id', async (request, response) => {
      await Blog.findByIdAndRemove(request.params.id)
        .then(()=>{
          response.status(204).end();
        })
  
        .catch((error) => error)
    });
  
  
    app.post('/api/bloglist', async (request, response) => {
    
  const body = request.body
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  
      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
  })
  
  
  const savedBlog = await blog.save()
  
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  
  response.json(savedBlog)
    })
  

    app.put('/:id', (request, response, next) =>{
        const body = request.body

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes
      })

      app.findByIdAndUpdate(request.params.id, blog, { new: true })
      .then(updatedNote => {
        response.json(updatedNote)
      })
      .catch(error => next(error))

    })

  app.use(unknownEndpoint)



  module.exports= app;
