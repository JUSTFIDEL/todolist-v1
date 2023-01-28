const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js')
const mongoose = require('mongoose')

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect('mongodb://127.0.0.1:27017/todoListDB')

const itemsSchema = {
  name: {
    type: String,
    require: [true, 'Filled cannot be blank']
  }
};

const Item = mongoose.model('Item', itemsSchema);

const welcome = new Item ({
  name: 'Welcome to your TodoList!'
});

const add = new Item ({
  name: 'Click the + button to add a new item.'
});

const del = new Item ({
  name: '<-- Hit to delete an item.'
});

const defaultItems = [welcome, add, del];
// const workItems = [];

app.get('/', (req, res) => {

  Item.find({}, (err, foundItems) => {
    
    const day = date.getDate();

    if (foundItems === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Items have been added succesfully !!!');
        }
      })
    } else {

      res.render('list', {

        listTitle: day,
        newListItems: foundItems

      });

    }

  })

})

app.post('/', (req,res) => {
  
  const item = req.body.newItem;

  if (req.body.list === 'Work List') {

    workItems.push(item);
    res.redirect('/work');

  } else {

    items.push(item);
    res.redirect('/')

  }
  
});

app.get('/work', (req, res) => {
  res.render('list', {
    listTitle: 'Work List',
    newListItems: workItems
  });
});

app.get('/about', (req, res) => {
  res.render('about');
})


app.listen(process.env.POST || 3000, (req, res) => {
  console.log('Server started on Port 3000');
})