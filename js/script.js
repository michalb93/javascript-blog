'use strict';

function titleClickHandler(event){
event.preventDefault();
const clickedElement = this;
 console.log('Link was clicked!');
  /* remove class 'active' from all article links  */
const activeLinks = document.querySelectorAll('.titles a.active');
for(let activeLink of activeLinks){
  activeLink.classList.remove('active');
}

  /* add class 'active' to the clicked link */
clickedElement.classList.add('active');
console.log('clickedElement:' ,clickedElement);

  /* remove class 'active' from all articles */
const activeArticles = document.querySelectorAll('.posts .active');
for(let activeArticle of activeArticles){
  activeArticle.classList.remove('active');
}
  /* get 'href' attribute from the clicked link */
  const articleSelector = this.getAttribute('href');
  console.log('Clicked Link:', articleSelector);

  /* find the correct article using the selector (value of 'href' attribute)(nic tu się nie zmienia) */
const targetArticle = document.querySelector(articleSelector);
console.log('Article:',targetArticle);
	
  /* add class 'active' to the correct article */
targetArticle.classList.add('active');

};

const links = document.querySelectorAll('.titles a');
for(let link of links){
  link.addEventListener('click', titleClickHandler);
}