module.exports = function author(page) {
  try {
    return page
      .split('<span class="user-info__nickname user-info__nickname_small">')[1]
      .split('</span>')[0];
  } catch (e) {
    return ""
  }
}
