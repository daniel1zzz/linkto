//Redirect to link
  
  const noExist = () => {
    document.querySelector('.img-status').setAttribute('class','img-status');
    const imgStatus = document.querySelector('.img-status > img');
    imgStatus.setAttribute('class','img-s');
    imgStatus.setAttribute('src','../img/delete-button.png');
    document.querySelector('.box-loading > h3').textContent = 'Invalid url!';
  }

  fetch(location.origin + '/api/open.php' + location.search)
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
