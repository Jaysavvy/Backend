const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
  }
  
  const url = 'mongodb+srv://jcheckside:SETUpAoC9gBS8oZD@cluster0.rli06k2.mongodb.net/?retryWrites=true&w=majority'

  mongoose.set('strictQuery',false)
mongoose.connect(url)

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
  })


  const Blog = mongoose.model('Blog', blogSchema)

  const blog = new Blog({
        title: "drinking to much coffee",
        author: "Tom winkler",
        url: "https://www.healthline.com/nutrition/caffeine-side-effects",
        likes: 100
  })

  blog.save().then(result => {
    console.log("blog saved!")
    mongoose.connection.close()
  })