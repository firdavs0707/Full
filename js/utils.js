let $ = function(selector, node = document) {
  return node.querySelector(selector);
}

let $$ = function(selector, node = document) {
  return node.querySelectorAll(selector);
}

let createElement = function(tagName, className = "", text) {
  let element = document.createElement(tagName);
  element.setAttribute("class", className);
  if (text) {
    element.textContent = text;
  }
  return element;
}