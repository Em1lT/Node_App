/*
*Team Yeti
*
* Javasciptr version that controls the mainfeed pages js.
* You need to be logged in to acces this page. You have options to like reviews and post your own review to
* the site. You can also check other peoples reviews.
*
* */
'use strict';

const fileInput = document.querySelector('#pic');
const upform = document.querySelector('#uploadform');
const feed = document.querySelector('#imagefeed');

const sFrm = document.querySelector('#searchform');
const radios = document.getElementsByName('rating-input-1');

const phone = document.querySelector('#phone');
const television = document.querySelector('#television');
const computer = document.querySelector('#computer');
const tablet = document.querySelector('#tablet');

const phoneform = document.querySelector('#phoneform');
const televisionform = document.querySelector('#tvform');
const computerform = document.querySelector('#computerform');
const tabletform = document.querySelector('#tabletform');

let username = "";
let likes = [];


//get user!
const getuser = () => {
  fetch('/node/users').then((response) => {
    console.log("fetch users posts");
    return response.json();
  }).then((user) => {
    user.forEach((userdata) => {
      username = userdata.username;
    });
  });
};
//get users likes
const getuserslike = () => {
  fetch('/node/user_likes').then((response) => {
    return response.json();
  }).then((data) => {
    data.forEach((userAndLike)=>{
      likes.push(userAndLike.Review_id);
    });
  });
}

// Sort by requested category
const categoryImages = (cat) => {
    fetch('/node/images').then((response) => {
        return response.json();
    }).then((json) => {
        console.log('Searching for -> ' + cat);
        feed.innerHTML = '';
        json.forEach((image) => {
            if(image.category === cat){
                const li = document.createElement('li');
                const div = document.createElement('div');
                div.className ="box";
                const product = document.createElement('div');
                product.className='productName';
                //const likeNo = document.createElement('h2');
                product.innerHTML = image.product;
                //likeNo.innerHTML = image.likes;
                const img = document.createElement('img');
                img.src = 'medium/' + image.image;
                const info = document.createElement('div');
                info.className= "info";
                const likeButton = makeLike(image);
                const likeDiv = document.createElement('div');
                likeDiv.className = "likeDiv";
                likeDiv.innerHTML = image.likes;
                likeDiv.appendChild(likeButton);
                info.appendChild(product);
                info.appendChild(likeDiv);
                div.appendChild(img);
                div.appendChild(info);
                li.appendChild(div);
                feed.appendChild(li);
            } else if(cat === '' || cat === ' ') {
                getImages();
            };
        });
    });
};

// Sort by requested rating
const searchImages = (stars) => {
    fetch('/node/images').then((response) => {
        return response.json();
    }).then((json) => {
        console.log('Searching for -> ' + stars);
        feed.innerHTML = '';
        json.forEach((image) => {
            if(image.stars === stars){
                const li = document.createElement('li');
                const div = document.createElement('div');
                div.className ="box";
                const product = document.createElement('div');
                product.className='productName';
                //const likeNo = document.createElement('h2');
                product.innerHTML = image.product;
                //likeNo.innerHTML = image.likes;
                const img = document.createElement('img');
                img.src = 'medium/' + image.image;
                const info = document.createElement('div');
                info.className= "info";
                const likeButton = makeLike(image);
                const likeDiv = document.createElement('div');
                likeDiv.className = "likeDiv";
                likeDiv.innerHTML = image.likes;
                likeDiv.appendChild(likeButton);
                info.appendChild(product);
                info.appendChild(likeDiv);
                div.appendChild(img);
                div.appendChild(info);
                li.appendChild(div);
                feed.appendChild(li);
            } else if(stars === '' || stars === ' ') {
                getImages();
            };
        });
    });
};

// Show all uploads
const getImages = () => {
  fetch('/node/images').then((response) => {
    return response.json();
  }).then((json) => {
    feed.innerHTML = '';
    json.forEach((image) => {
        const li = document.createElement('li');
        const div = document.createElement('div');
        div.className ="box";
        
        const product = document.createElement('div');
        product.className='productName';
        product.innerHTML = image.product;
        
        const stars = document.createElement('div');
        stars.className='stars';
        stars.innerHTML = "stars:" + image.stars;

        const price = document.createElement('div');
        price.className='price';
        price.innerHTML = "price:" + image.price;
        
        const img = document.createElement('img');
        img.src = 'medium/' + image.image;
        
        const info = document.createElement('div');
        info.className= "info";
        
        const likeButton = makeLike(image);
        const likeDiv = document.createElement('div');
        likeDiv.className = "likeDiv";
        likeDiv.innerHTML = image.likes;
        likeDiv.appendChild(likeButton);
        div.appendChild(product);
        info.appendChild(stars);
        info.appendChild(price);
        info.appendChild(likeDiv);
        div.appendChild(img);
        div.appendChild(info);
        li.appendChild(div);
        feed.appendChild(li);
    });
  });
};
//make the like button. It will unavailable if the picture is uploaded by you or are already liked it.
const makeLike = (image) => {
    const form = document.createElement('form');
    form.action = "/node/likeImage";
    form.id = "likeImage";
    const inputId = document.createElement('input');
    inputId.name = "id";
    inputId.value = image.id;
    inputId.hidden= true;
    const sendButton = document.createElement('button');
    sendButton.type = "Like";
    sendButton.id = "likeButton";
    const likeIcon = document.createElement('i');
    likeIcon.className = 'far fa-thumbs-up ';
    sendButton.appendChild(likeIcon);
    //sendButton.innerHTML = "like";
    if(image.owner == username || likes.includes(image.id)){
      sendButton.setAttribute("disabled", true);
    }
    form.appendChild(inputId);
    form.appendChild(sendButton);
    return form;
  };

// Form for searching with radio buttons aka stars
const searchForm = (evt) => {
    evt.preventDefault();
    fetch('/node/search').then((response) => {
        return response.json();
    }).then((json) => {
        //console.log(json);
        for (var i = 0, length = radios.length; i < length; i++){
            if (radios[i].checked){
                const searchword = radios[i].value
                searchImages(searchword);
                break;
            }
        }
    });
};

// Forms for category searching
const phoneForm = (evt) => {
    evt.preventDefault();
    fetch('/node/phone').then((response) => {
        return response.json();
    }).then((json) => {
        const searchword = phone.value;
        categoryImages(searchword);
    });
};
const televisionForm = (evt) => {
    evt.preventDefault();
    fetch('/node/television').then((response) => {
        return response.json();
    }).then((json) => {
        const searchword = television.value;
        categoryImages(searchword);
    });
};
const computerForm = (evt) => {
    evt.preventDefault();
    fetch('/node/computer').then((response) => {
        return response.json();
    }).then((json) => {
        const searchword = computer.value;
        categoryImages(searchword);
    });
};
const tabletForm = (evt) => {
    evt.preventDefault();
    fetch('/node/tablet').then((response) => {
        return response.json();
    }).then((json) => {
        const searchword = tablet.value;
        categoryImages(searchword);
    });
};

const sendForm = (evt) => {
    evt.preventDefault();
  console.log('sendForm()');
  const fd = new FormData(upform);
  const settings = {
    method: 'post',
    body: fd,
  };
  fetch('/node/upload', settings).then((response) => {
    return response.json();
  }).then((json) => {
    console.log(json);
    getImages();
  });
};

//Check if file is selected
const check = () => {
  if (!fileInput.isEmpty) {
    document.querySelector('#ButtonSend').removeAttribute('disabled');
  }
};

//Upload form
upform.addEventListener('submit', sendForm);
//Search form
sFrm.addEventListener('submit', searchForm);

//Forms for category buttons
phoneform.addEventListener('submit', phoneForm);
televisionform.addEventListener('submit', televisionForm);
computerform.addEventListener('submit', computerForm);
tabletform.addEventListener('submit', tabletForm);

getuser();
getuserslike();
getImages();