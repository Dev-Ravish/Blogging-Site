const express = require('express');
const { result } = require('lodash');
const { default: mongoose } = require('mongoose');
const morgan = require('morgan');  
const Blog = require('./models/blog');

//express app
const app=express();

//connect to mongodb
const dbURI = 'mongodb+srv://test:test1234@learn-node.ryfno.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dbURI, {useNewUrlParser:true ,useUnifiedTopology:true}) //it is asynchronous so takes time
    .then((result)=> {
        console.log('connected to db');
        app.listen(3000);
    })
    .catch((err)=> console.log(err))


//register view engine
app.set('view engine', 'ejs'); 

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));


app.get('/', (req, res)=>{
    res.redirect('/blogs')
});

app.get('/about', (req, res)=>{

    res.render('about' ,{title: 'About'});
});

app.get('/blogs',  (req, res)=>{
    Blog.find().sort({createdAt: -1})
        .then(result=>{
             res.render('index', {title: 'All blogs', blogs: result});
        })
        .catch(err=>{
            console.log(err);
        })
    
});

app.post('/blogs', (req, res)=>{
    const blog = new Blog(req.body);
    blog.save()
        .then((result)=>{
            res.redirect('/blogs');
        })
        .catch(err=>{
            console.log(err)
        })
});

app.get('/blogs/create', (req,res)=>{
    res.render('create' ,{title: 'Create A New Blog'});
});

app.get('/blogs/:id', (req, res)=>{
    const id =req.params.id;
    Blog.findById(id)
        .then(result=>{
            res.render('details', {title:'Blog details', blog: result})
        })
        .catch(err=>{
            console.log(err)
        })
})

app.delete('/blogs/:id', (req, res)=>{
    const id=req.params.id;
    Blog.findByIdAndDelete(id)
        .then(result=>{
            res.json({redirect: '/blogs'});
        })
        .catch(err=>{
            console.log(err)
        })
})



//404
app.use((req,res)=>{  //use iss for every single request so keep it to the bottom so that it does not interfair with other urls

    res.status(404).render('404' ,{title: '404 - error'});
});
