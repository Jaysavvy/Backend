const blogsRouter = require("express").Router();
const Blog = require("../module/blog");

  
  blogsRouter.get('/api/bloglist', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })
  
  blogsRouter.get('/api/bloglist/:id', (request, response, next) => {
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
  
    blogsRouter.delete('/api/bloglist/:id', (request, response) => {
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
  
    blogsRouter.post('/api/bloglist', (request, response) => {
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
  

    blogsRouter.put('/:id', (request, response, next) =>{
        const body = request.body

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes
      })

      Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
      .then(updatedNote => {
        response.json(updatedNote)
      })
      .catch(error => next(error))

    })





module.exports = blogsRouter;
