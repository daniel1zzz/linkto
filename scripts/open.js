//Redirect to link
if(location.pathname === '/open'){

  document.querySelector('body').innerHTML = `
    <article class="box-loading">
      <div class="img-status loader">
        <img/>
      </div>
      <h3 class="text-loading">Redirect...<h3>
    </article>
    <div class="t-header l-created">
      <a href="https://google.com" target="_blank" title="Ver codigo fuente en github">
        <img src="img/github.png" class="img-github"/>
      </a>
      <label class="l-g-s">Source</label>
    </div>
  `;
  
  const noExist = () => {
    document.querySelector('.img-status').setAttribute('class','img-status');
    const imgStatus = document.querySelector('.img-status > img');
    imgStatus.setAttribute('class','img-s');
    imgStatus.setAttribute('src','../img/delete-button.png');
    document.querySelector('.box-loading > h3').textContent = 'Invalid url!';
  }

  fetch('/api/open.php' + location.search)
  .then(data => data.json())
  .then(data => {
    if(data.ok) {
      const url = data.link.indexOf("https://") == -1 ? 
      "https://" + data.link : data.link;
      location.href = url;
    } else if(data.error) {
      alert('Oops... an error occurred: ' + data.error);
    } else noExist();
  }).catch(error => alert('Oops... an error occurred: ' + error));

}