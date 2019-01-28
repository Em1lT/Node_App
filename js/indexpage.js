/*
* Team Yeti
* Javascipt file for index. It shows you the newest reviews in without login.
*
* */
'use strict';

//all of the elements selelcted
const indexFooder = document.querySelector('#indexFeed');

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

//fetches the images that are in the category
const categoryImages = (cat) => {
    fetch('/node/images').then((response) => {
        return response.json();
    }).then((json) => {
        //console.log(json);
        //console.log('Searching for -> ' + cat);
        //feed.innerHTML = '';
        indexFooder.innerHTML = '';
        json.forEach((image) => {
            if(image.category === cat){
                const li = document.createElement('li');
                const div = document.createElement('div');
                div.className = 'box';
                const product = document.createElement('div');
                product.className = 'productName';
                //.likeDiv >  .likeIcon
                //const likeNo = document.createElement('p');
                //likeNo.className = 'likeNo';
                 const likeIcon = document.createElement('i');
                 likeIcon.className = 'far fa-thumbs-up fa-fw';
                const likeDiv = document.createElement('div');
                likeDiv.className = 'likeDiv';
                likeDiv.innerHTML = image.likes;
                likeDiv.appendChild(likeIcon);
                //likeDiv.appendChild(likeNo);
                //.info > .productName + .likeDiv
                const info = document.createElement('div');
                info.className = 'info';
                info.appendChild(product);
                info.appendChild(likeDiv);
                //.box > img + .info
                product.innerHTML = image.product;
                const img = document.createElement('img');
                img.src = 'medium/' + image.image;
                div.appendChild(img);
                div.appendChild(info);
                //li > .box
                li.appendChild(div);
                indexFooder.appendChild(li);
            } else if(cat === '' || cat === ' ') {
                getImages();
            };
        });
    });
};
//search images
const searchImages = (stars) => {
    fetch('/node/images').then((response) => {
        return response.json();
    }).then((json) => {
        //feed.innerHTML = '';
        indexFooder.innerHTML = '';
        json.forEach((image) => {
            if(image.stars === stars){
                const li = document.createElement('li');
                const div = document.createElement('div');
                div.className = 'box';
                const product = document.createElement('div');
                product.className = 'productName';
                //.likeDiv >  .likeIcon
                //const likeNo = document.createElement('p');
                //likeNo.className = 'likeNo';
                 const likeIcon = document.createElement('i');
                 likeIcon.className = 'far fa-thumbs-up fa-fw';
                const likeDiv = document.createElement('div');
                likeDiv.className = 'likeDiv';
                likeDiv.innerHTML = image.likes;
                likeDiv.appendChild(likeIcon);
                //likeDiv.appendChild(likeNo);
                //.info > .productName + .likeDiv
                const info = document.createElement('div');
                info.className = 'info';
                info.appendChild(product);
                info.appendChild(likeDiv);
                //.box > img + .info
                product.innerHTML = image.product;
                const img = document.createElement('img');
                img.src = 'medium/' + image.image;
                div.appendChild(img);
                div.appendChild(info);
                //li > .box
                li.appendChild(div);
                indexFooder.appendChild(li);
            } else if(stars === '' || stars === ' ') {
                getImages();
            };
        });
    });
};
//get images and put them in a div
const getImages = () => {
  fetch('/node/images').then((response) => {
    return response.json();
  }).then((json) => {
    //feed.innerHTML = '';
    indexFooder.innerHTML = '';
    json.forEach((image) => {
        const li = document.createElement('li');
        const div = document.createElement('div');
        div.className = 'box';
        const product = document.createElement('div');
        product.className = 'productName';
        //.likeDiv >  .likeIcon
        //const likeNo = document.createElement('p');
        //likeNo.className = 'likeNo';
         const likeIcon = document.createElement('i');
         likeIcon.className = 'far fa-thumbs-up fa-fw';
        const likeDiv = document.createElement('div');
        likeDiv.className = 'likeDiv';
        likeDiv.innerHTML = image.likes;
        likeDiv.appendChild(likeIcon);
        //likeDiv.appendChild(likeNo);
        //.info > .productName + .likeDiv
        const info = document.createElement('div');
        info.className = 'info';
        info.appendChild(product);
        info.appendChild(likeDiv);
        //.box > img + .info
        product.innerHTML = image.product;
        const img = document.createElement('img');
        img.src = 'medium/' + image.image;
        div.appendChild(img);
        div.appendChild(info);
        //li > .box
        li.appendChild(div);
        indexFooder.appendChild(li);
    });
  });
};


// all of the needed form to search
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

//event listeneres
sFrm.addEventListener('submit', searchForm);

//Forms for category buttons
phoneform.addEventListener('submit', phoneForm);
televisionform.addEventListener('submit', televisionForm);
computerform.addEventListener('submit', computerForm);
tabletform.addEventListener('submit', tabletForm);

getImages();