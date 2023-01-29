const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js')
const mongoose = require('mongoose')
const _ = require('lodash')

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect('mongodb://127.0.0.1:27017/todoListDB')

const itemsSchema = {
  name: {
    type: String,
    require: [true, 'Field cannot be blank']
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

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model('List', listSchema);



app.get('/', (req, res) => {

  Item.find({}, (err, foundItems) => {
    
    // const day = date.getDate();

    if (foundItems === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Items have been added succesfully !!!');
        }
      })

      res.redirect('/');
    
    } else {

      res.render('list', {

        listTitle: 'Today',
        newListItems: foundItems

      });

    }

  })

})

app.get('/:customListName', (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, (err, foundList) => {
    if(!err) {
      if (!foundList) {
        //Create a new list

        const list = new List({
        name: customListName,
        items: defaultItems
  })
  
  list.save();
  res.redirect('/' + customListName)
      } else {
        //Show an existing list

        res.render('list', {
          listTitle: foundList.name,
          newListItems: foundList.items
        })

      }
    }
  })

  

})

app.post('/', (req,res) => {
  
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === 'Today') {
    item.save();
    res.redirect('/');
  } else {
    List.findOne({
      name: listName}, (err, foundList) => {
        foundList.items.push(item);
        foundList.save();
        res.redirect('/' + listName)
      })
  }

  

});

app.post('/delete', (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === 'Today') {
    Item.findByIdAndRemove(checkedItemId, (err) => {
    if (!err) {
      console.log('Successfully deleted checked item');
      res.redirect('/')
    }
  })
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, foundList) => {
      if (!err) {
        res.redirect('/' + listName)
      }
    })
  }

  
})

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