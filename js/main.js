/*
* Team Yeti
* This is the javascript file for the profile screen.it fetches the pictures and information about yourself like
* your email and how many posts you have.
* */
'use strict';
console.log('main.js');
const list = document.querySelector('#user');
const ownFeed = document.querySelector('#Ownfeed');
const updateForm = document.querySelector('#updateform');


//get the users information and makes a profile box from them
const getUser = () => {
  fetch('/node/users').then((response) => {

    return response.json();
  }).then((json) => {
    json.forEach((user) => {
      document.getElementById('user').appendChild(constructUser(user));

    });
  });
};
//constructs the user information(title, interested category, email, posts)
const constructUser = (user) => {
  const li = document.createElement('li');
  const title = document.createElement('h2');
  const posts = document.createElement('p');
  const email = document.createElement('p');
  const Inte = document.createElement('p');
  title.innerHTML = user.username;
  posts.innerHTML = 'Posts: ' + user.posts;
  email.innerHTML = user.email;
  Inte.innerHTML = 'main interest: ' + user.interest;
  li.appendChild(title);
  li.appendChild(Inte);
  li.appendChild(email);
  li.appendChild(posts);
  return li;
};
//Fetches the user posts
const userposts = () => {
  fetch('/node/userPosts').then((response) => {
    return response.json();
  }).then((json) => {

    // list.innerHTML = '';
    json.forEach((image) => {
      buildUserPosts(image);
    });
  });
};
//function to build user posts
const buildUserPosts = (image) => {
  const li = document.createElement('li');
  const container = document.createElement('div');
  container.className = 'container';
  const product = document.createElement('div');
  product.className = 'productName';
  const like = document.createElement('div');
  like.className = 'likeNo';
  product.innerHTML = image.product;
  like.innerHTML = image.likes;
  const likeIcon = document.createElement('i');
  likeIcon.className = 'far fa-thumbs-up ';
  like.appendChild(likeIcon);
  const img = document.createElement('img');
 // const update = document.createElement('button');
  //update.innerHTML = 'update';
  const deleteImg = document.createElement('button');
  deleteImg.innerHTML = 'delete';
  img.src = 'thumbs/' + image.thumbnail;
  const updateForm = addupdate(image);
  const riseDiv = document.createElement('div');
  riseDiv.className = 'overlay';
  const deleteForm = addDelete(image);
  const buttonDiv = document.createElement('div');
  buttonDiv.className = 'buttonDiv';
  const info = document.createElement('div');
  info.className = 'info';
  //buttonDiv.appendChild(update);
  buttonDiv.appendChild(deleteForm);
  info.appendChild(product);
  info.appendChild(like);
  riseDiv.appendChild(info);
  riseDiv.appendChild(buttonDiv);
  container.appendChild(riseDiv);
  container.appendChild(img);
  li.appendChild(container);
  ownFeed.appendChild(li);
};
//adds an update button... not used in current version.
const addupdate = (image) => {
  const form1 = document.createElement('form');
  form1.action = '/node/update';
  form1.id = 'updateform';
  form1.hidden = true;
  const inputProduct = document.createElement('input');
  inputProduct.name = 'product';
  inputProduct.placeholder = 'Product';
  const inputPrice = document.createElement('input');
  inputPrice.name = 'price';
  inputPrice.placeholder = 'Price';
  const inputId = document.createElement('input');
  inputId.name = 'id';
  inputId.value = image.id;
  inputId.hidden = true;
  const sendButton = document.createElement('button');
  sendButton.type = 'submit';
  sendButton.innerHTML = 'update';
  form1.appendChild(inputProduct);
  form1.appendChild(inputPrice);
  form1.appendChild(inputId);
  form1.appendChild(sendButton);
  return form1;
};
//add a button to delete files
const addDelete = (image) => {
  const form = document.createElement('form');
  form.action = '/node/delete';
  form.id = 'deleteform';
  const inputId = document.createElement('input');
  inputId.name = 'id';
  inputId.value = image.id;
  inputId.hidden = true;
  const sendButton = document.createElement('button');
  sendButton.type = 'delete';
  sendButton.id = 'but';
  sendButton.innerHTML = 'delete';
  form.appendChild(inputId);
  form.appendChild(sendButton);
  return form;
};
//shows form. not used but working
const showForm = (img) => {

  document.querySelector('#updateform input[name=id]').value = img.id;
  updateForm.removeAttribute('hidden');
};

userposts();
getUser();