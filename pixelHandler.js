
var faunadb = window.faunadb
var q = faunadb.query
var client = new faunadb.Client({
  secret: 'fnAEjrpvNoAAwFcmnqB8fJEAJvS1E95-LhqVQKsH',
  domain: 'db.eu.fauna.com',
  scheme: 'https',
})

let selectedpixel = null
let pixels = []


function makeid(length) {
    var result           = '';
    var characters       = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}


function sleep(milisec) {
  return new Promise(resolve => {
  setTimeout(() => { resolve('') }, milisec);
  })
  }

window.onload = function(){

    client.query(
        q.Get(
          q.Match(q.Index('canvas_by_name'), "r/place")
        )
      )
            
      .then(function(ret) {
        id = ret.ref.value.id
        var docRef = q.Ref(q.Collection('canvas'), id)
    
    function report(e) {
        pixels = []
        for (let i = 0; i < e.data.pixels.length; i++) {
          pixels.push({colour: e.data.pixels[i].colour, num: e.data.pixels[i].num, owner: e.data.pixels[i].owner})
        }
        populateGrid(75)
      var data = ('action' in e)
        ? e["document"].data
        : e.data
      
      
    }
    
    var stream
    const startStream = () => {
      stream = client.stream.document(docRef)
      .on('snapshot', snapshot => {
        report(snapshot)
      })
      .on('version', version => {
        report(version)
      })
      .on('error', error => {
        console.log('Error:', error)
        stream.close()
        setTimeout(startStream, 1000)
      })
      .start()
    }
    
    startStream()
    
    
    })
          .catch(function(e){
              console.log(e)
             document.write("Error: " + e)
          });


    populateGrid(75)


}

function populateGrid(amount){

  client.query(
    q.Get(
      q.Match(q.Index('canvas_by_name'), "r/place")
    )
  )
        
  .then(function(ret) {
  
    document.getElementById("grid").innerHTML = ""
    document.getElementById("grid").style.setProperty('--size', amount)
    for (let i = 0; i < amount * amount; i++) {

    
      
        let div = document.createElement('div')
        div.id = i
        div.classList.add('pixel')
        div.addEventListener('click', function(){

            highlight(i)
        })
        if(i == selectedpixel){
          div.style.backgroundColor = document.getElementById("colour").value
        }
        let index = ret.data.pixels.findIndex(function(item, z) {
            return item.num === i
          });
          if(index != -1){
              div.style.backgroundColor = ret.data. pixels[index].colour
          }

          

          
 
        document.getElementById("grid").appendChild(div)
      

    }

})
      .catch(function(e){
          console.log(e)
         document.write("Error: " + e)
      });


    
}

async function highlight(num){

  let oldColour = document.getElementById(num).style.backgroundColor
  selectedpixel = num
    populateGrid(75)

   await sleep(500)

    
    let owner = ""
    let index = pixels.findIndex(function(item, z) {
        return item.num === num
      });
      if(index != -1)
      {
          owner = pixels[index].owner
      }
      else{
          owner = "No One"
      }
    if(oldColour == "")
    {
        oldColour = "None"
    }
    document.getElementById(num).style.backgroundColor = document.getElementById("colour").value
    document.getElementById("selected").innerHTML = "Selected: Pixel <b>" + num + "</b><br>Current Colour: <b><font style=\"color:" + oldColour + "\">" + oldColour + "</font></b><br>Owned by: <b>" + owner + "</b>"
   
    
}

function place(){
    if(selectedpixel == null)
    {
        alert("Please select a pixel!")
    }
    else{


      client.query(
        q.Get(
          q.Match(q.Index('canvas_by_name'), "r/place")
        )
      )
            
      .then(function(ret) {
      
        let pixels = ret.data.pixels
        let index =pixels.findIndex(function(item, z) {
          return item.num === selectedpixel
        });
        if(index != -1){
            pixels.splice(index, 1)
            pixels.push({num: selectedpixel, colour: document.getElementById("colour").value, owner: localStorage.getItem("placeUsername")})
        }
        else{
          pixels.push({num: selectedpixel, colour: document.getElementById("colour").value, owner: localStorage.getItem("placeUsername")})
        }


     
  
      client.query(
        q.Update(q.Ref(q.Collection("canvas"), "328404991715836096"), {
        data: {
          pixels: pixels
        },
        })
        ).then(function(ret){
    
          alert("Pixel placed!")

    
      }).catch(function(e){
    
          console.error(e)
    
      });


    
    })
          .catch(function(e){
              console.log(e)
             document.write("Error: " + e)
          });

          
          
        


    
    }
    
}
