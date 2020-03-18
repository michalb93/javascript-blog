'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML),
}

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

}




//algorytm GenerateTitleLinks

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags .list',
  optCloudClassCount = '5',
  optCloudCLassPrefix = 'tag-size-',
  optAuthorsListSelector = '.authors';

function generateTitleLinks(customSelector = ''){

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
	
  /* find all the articles and save them to variable: articles */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  console.log(optArticleSelector + customSelector);
  let html = '';
	
  /* for each article */
  for(let article of articles){
  /* get the article id */
    const articleId = article.getAttribute('id');
    /* find the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    /* get the title from the title element */
	
    /* create HTML of the link */
    //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    //console.log(linkHTML);
	const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    /* insert link into html variable */
    html = html + linkHTML;
    console.log(html);
  }
  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
	
}
generateTitleLinks();


function calculateTagsParams(tags){
  const params = {
	  max: '0', 
	  min: '999999'
  };
  for(let tag in tags){
    if(tags[tag] > params.max){
      params.max = tags[tag];
	}
  for(let tag in tags){
    if(tags[tag] < params.min){
      params.min = tags[tag];
	}
  }
	console.log(tag + ' is used ' + tags[tag] + ' times');
  }	
  return params;
}

function calculateTagClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
  const classAndValueNumber = optCloudCLassPrefix + classNumber;
  return classAndValueNumber;
}

/*generate tags*/
function generateTags(){
  /* [NEW] create a new variable allTags with an empty array */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  
  for(let article of articles){	  
    /* find tags wrapper */
    const tagList = article.querySelector(optArticleTagsSelector);
    /* make html variable with empty string */
	let html ='';
    /*tagList.innerHTML = '';*/
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){
      /* generate HTML of the link TU CHYBA JEST BLAD*/
      const linkHTML = '<li><a href="#' + tag + '"><span>' + tag + '</span></a></li>';
      /* add generated code to html variable */
      html = html + linkHTML + ' ';
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags.hasOwnProperty(tag)){
        /* [NEW] add generated code to allTags array */
        allTags[tag] = 1;
	    /* END LOOP: for each tag */
	  } else {
	    allTags[tag]++;
	  }
	  tagList.innerHTML = html;
	}
    /* insert HTML of all the links into the tags wrapper */

  /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector('.tags');
  /*[NEW] create variable for all links HTML code*/
  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams)
  //let allTagsHTML = '';
  const allTagsData = {tags: []};
  /*[NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags){
	  /*[NEW] generate code of a link and add it to allTagsHTML*/
	  //allTagsHTML += tagLinkHTML; - ta linia doklejala kod kolejnego linka do allTagsHTML?????
	  //allTagsHTML += tag+ ' (' + allTags[tag] + ') ';
	  allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
});
	  const tagLinkHTML = '<li>' + calculateTagClass(allTags[tag], tagsParams); + '</li>';
	  console.log('taglinkHTML:', tagLinkHTML);
  }
  /*NEW END LOOP: for each tag in allTags: */
  
  /*[NEW] add html from allTagsHTML to tagList */
  //tagList.innerHTML = allTagsHTML;
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  console.log('allTagsData:',allTagsData);
}
  
generateTags();

function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = this.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for(let activeTag of activeTags){
	/* remove class active */
    activeTag.classList.remove('active')
  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
  /* START LOOP: for each found tag link */
  for(let tagLink of tagLinks){ 
    /* add class active */
    tagLink.classList.add('active')
  /* END LOOP: for each found tag link */
  } 
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const allTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each link */
  for(let tag of allTagLinks){
	tag.addEventListener('click', tagClickHandler);  
    /* add tagClickHandler as event listener for that link */
    }
}

addClickListenersToTags();

/*GENERATE AUTHORS*/
function generateAuthors() {
  let allAuthors = {};
  const articles = document.querySelectorAll(optArticleSelector);
  
   //add Handlebars:
  const allAuthorsData = { authors: [] };
  const authorSidebar = document.querySelector(optAuthorsListSelector);

  for (let article of articles) {

    let author = article.getAttribute('data-author');
    /*find author wrapper*/
    const authorList = article.querySelector(optArticleAuthorSelector);
    let html = '';
    /* get author attribute */
    const articleAuthor = article.getAttribute('data-author');
	if (!allAuthors.hasOwnProperty(articleAuthor)) {
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }

    //const authorLinkHTML = '<li><a href="#author-' + articleAuthor + '"><span>' + articleAuthor + '</span></a></li>';

    //add handlebars:
    const linkHTMLData = { id: articleAuthor, title: articleAuthor };
    const authorLinkHTML = templates.authorLink(linkHTMLData);

    /* add generated code to html variable */
    html = html + authorLinkHTML;
    /* add html for each author wrapper */
    authorList.innerHTML = html;
  }

  for (let author in allAuthors) {
    //const asideAuthorLinkHTML = '<li><a href="#author-' + author + '"><span>' + author + " (" + allAuthors[author] + ")" + '</span></a></li>';
    //add Handlebars:    
    allAuthorsData.authors.push({
    author: author,
    count: allAuthors[author]
    });
    //htmlSidebar += asideAuthorLinkHTML;
  }
  //authorSidebar.innerHTML = htmlSidebar;
  authorSidebar.innerHTML = templates.authorCloudLink(allAuthorsData);
}

generateAuthors();

function authorClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  
  clickedElement.classList.add('active');
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = this.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const author = href.replace('#author-', '');
  /* find all tag links with class active */
  const activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');
  /* START LOOP: for each active tag link */
  for(let activeAuthor of activeAuthors){
	/* remove class active */
    activeAuthor.classList.remove('active')
  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const authorLinks = document.querySelectorAll('a[href^="#author-' + author + '"]');
  /* START LOOP: for each found tag link */
  for(let authorLink of authorLinks){ 
    /* add class active */
    authorLink.classList.add('active')
  /* END LOOP: for each found tag link */
  } 
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author~="' + author + '"]');
}


function addClickListenersToAuthors(){
  /* find all links to tags */
  const allAuthorsLinks = document.querySelectorAll('a.active[href^="#author-"]');
  /* START LOOP: for each link */
  for(let author of allAuthorsLinks){
	author.addEventListener('click', authorClickHandler);  
    /* add tagClickHandler as event listener for that link */
    }
}
addClickListenersToAuthors();