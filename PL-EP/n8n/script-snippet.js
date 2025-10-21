// In your video row creation
videoRow.innerHTML = `
  <td class="col-number">${counter++}</td>
  <td class="col-thumbnail videoThumbnail"><img src="${thumbnail}" alt="${title}" /></td>
  <td class="col-title">${title}</td>
  <td class="col-date">${publishDate}</td>
  <td class="col-duration">${duration}</td>
  <td class="col-chapters">${chapters}</td>
`;