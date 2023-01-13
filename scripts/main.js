const $urlOriginal = document.querySelector('#url-original');
const $urlGenerated = document.querySelector('#url-generated');
const modalMessage = document.querySelector('#message');

const modalActive = (state, text) => {
  const $img = modalMessage.querySelector('#message > img');
  const $text = document.querySelector('#message > label');
  if(state){
    $img.setAttribute('src','img/accept.png');    
  } else {
    $img.setAttribute('src','img/delete-button.png');
  }
  $text.textContent = text;
  modalMessage.removeAttribute('hidden');
  setTimeout(function() {
    modalMessage.setAttribute('hidden','');
  }, 3000);
}
const activeCopy = () => {
  const $copy = document.querySelector('.box-link > span');
  $copy.removeAttribute('hidden');
}
const copyToClipboard = () => {
  const text = document.querySelector('.box-link > input').value;
  navigator.clipboard.writeText(text).then(() => {
    modalActive(true, 'Copied to clipboard successfully');
  });
}
const validURL = (miurl) => {
  var expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  var regex = new RegExp(expression);
  
  if (miurl.match(regex)) return true;
  else return false;
}
const post = (url, data, callback) => {
  fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  })
  .then((response) => response.json())
  .then((data) => callback(data))
  .catch((error) => alert('Error: ' + error));
}

document.querySelector('.box-link > span').addEventListener('click',() => {
  copyToClipboard();
});

$urlOriginal.addEventListener('input', () => {
  if(validURL($urlOriginal.value)) {
    $urlOriginal.setAttribute('aria-invalid','false');
  } else {
    $urlOriginal.setAttribute('aria-invalid','true');
  }
});

document.querySelector('#btn-created').addEventListener('click', () => {
  let url = $urlOriginal.value;
  if(validURL(url)) {
    post('/api/register.php', {url: url}, (data) => {
      if(data.ok) {
        $urlGenerated.value = location.href + 'open?id=' + data.link;
      } else {
        alert('Oops... an error occurred: ' + data.error);
      }
    });
    modalActive(true,'Done URL generated successfully!');
    activeCopy();
  } else {
    modalActive(false,'Please enter a valid URL');
    $urlOriginal.setAttribute('aria-invalid','true');
  }
  console.log('btn-created')
});

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