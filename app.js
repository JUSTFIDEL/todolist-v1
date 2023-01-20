const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js')

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));


const items = ['Buy Food', 'Cook Food', 'Eat Food'];
const workItems = [];

app.get('/', (req, res) => {

  const day = date.getDate();

  res.render('list', {
    listTitle: day,
    newListItems: items
  });

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