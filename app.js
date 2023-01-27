

const express = require('express');
const app = express();
const bodyParser = require ('body-parser');
const ejs = require ('ejs');
const https = require('https');
const mongoose = require('mongoose');


app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}));


mongoose.set('strictQuery', false);

main().catch((err) => console.log(err));




async function main(){
  await mongoose.connect('mongodb+srv://admin-franklin:Qwerty12345@cluster0.zwmm5rv.mongodb.net/todolistDB')

  const itemSchema = new mongoose.Schema({
    item: String
  })

  const listSchema = new mongoose.Schema({
    name: String,
    list: [itemSchema]
  })

  const List = new mongoose.model('List', listSchema)


  const Item = new mongoose.model('Item', itemSchema)


  const item1 = new Item ({
    item: 'Write and Hit the + to add to your todolist' 
  })

  const item2 = new Item ({
    item: 'Click the checkbox to remove item from your todolist'
  })

  const defaultArray = [item1, item2]

  


  app.get('/', function(request, response){
   
      Item.find({}, function(err, result){

        if (result.length === 0){

          Item.insertMany(defaultArray, function(err){
            if (err){
              console.log(err)
            }else{
              console.log('Save Successful!')
            }
          })
          response.redirect('/');
    
        }else{
          response.render('list', {listTitle: 'Today', newListItems: result})
        }
      })
       
        
    
    


  })
  app.post('/', function(request, response){
    const tokeep = request.body.newItem;

    const addedItems = new Item ({
      item: tokeep
    })

    addedItems.save();

    response.redirect('/');
  })

  app.post('/delete', function(request, response){
    const toRemove = request.body.checked;

    Item.findByIdAndRemove({_id: toRemove}, function(err){
      if (err){
        console.log(err)
      }else{
        console.log('Removed Item');
      }
      response.redirect('/');
    })
  })



  app.get('/:toucheddd', function(request, response){
    const asked = request.params.toucheddd

    List.find({}, function(err, result){
      result.forEach(function(found){

        const nameee = found.name;
        const listss = found.list;

        if (asked == nameee){
          response.render('list', {listTitle: nameee, newListItems: listss})
        }else{
          const newest = new List ({
            name: asked,
            list: [defaultArray]
          }) 
  
          newest.save();
  
          response.redirect('/nameee');
        }

      })

      
    })
  })


  // app.get('/:touch', function(request, response){
  //   const asked = request.params.touch;
  //   List.find({}, function(err, result){
  //     if (err){
  //       console.log(err)
  //     }else{
  //       result.forEach(function(post){
  //         const titleOfList = post.name;
  //         const content = post.list
  
  //         if (asked === titleOfList){
  //           response.render('list', {listTitle: titleOfList, newListItems:content});
  //         } else{
  //           const newList = new List ({
  //             name: asked,
  //             list: defaultArray
  //           })
  //           newList.save();
  //           response.render('list', {listTitle:asked, newListItems: defaultArray})
  //         }
  //       })
  //     }
     
  //   })
    
   
  // })

  // app.get("/:touch", function(req,res){
  //   const requesteddd = req.params.touch;

  //   List.find({}, function(err, result){
  //     result.forEach(function(content){
      

  //       const found = content.name
  //       const lister = content.list



       
  //       if (requesteddd === found){
  //         res.render("list", {listTitle: found, newListItems:lister});
        
  //       }else{

  //         const list1 = new List({
  //           name: requesteddd,
  //           list: [item1, item2]
  //         })
    
  //         list1.save();
  //         res.redirect('/requesteddd');

  //       }



  //     })
  //   })

    


    
    
  // });










}








app.listen(process.env.PORT || 3000, function(){
  console.log('Server already started!!')
})