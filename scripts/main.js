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
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    modalActive(true, 'Copied to clipboard successfully');
  } catch (err) {
    modalActive(false,'Unable to copy to clipboard!');
  }
  document.body.removeChild(textArea);
  //Codigo solo funciona para https 
  //navigator.clipboard.writeText(text).then(() => {
  //  modalActive(true, 'Copied to clipboard successfully');
  //});
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
        modalActive(true,'Done URL generated successfully!');
        activeCopy();
        $urlGenerated.value = location.origin + 'rd.html?id=' + data.link;
      } else {
        alert('Oops... an error occurred: ' + data.error);
        modalActive(false,'Server error!');
      }
    });
  } else {
    modalActive(false,'Please enter a valid URL');
    $urlOriginal.setAttribute('aria-invalid','true');
  }
  console.log('btn-created')
});