const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user")

  
  blogsRouter.get('/api/bloglist', async (request, response) => {
    const blogs = await Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })
  
  blogsRouter.get('/api/bloglist/:id', async (request, response, next) => {
    
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
  
    blogsRouter.delete('/api/bloglist/:id', async (request, response) => {
      await Blog.findByIdAndRemove(request.params.id)
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
  
    blogsRouter.post('/api/bloglist', async (request, response) => {
      const body = request.body

      const user = await User.findById(body.userId)
  
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
