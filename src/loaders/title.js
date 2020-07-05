const tryExec = (fn) => {
  try {
    return fn();
  } catch (e) {
    return false;
  }
}

module.exports = function title(page) {
  const title = [
    () => page.split('<meta property="og:title" content="')[1].split('" />')[0],
    () => page.split('<title>')[1].split('</title>')[0],
    () => page.split('<title data-rh="true">')[1].split('</title>')[0]
  ]
    .map(tryExec)
    .find(Boolean);

  if (title) {
    return title.trim();
  }

  throw "Не удалось получить заголовок";
}

