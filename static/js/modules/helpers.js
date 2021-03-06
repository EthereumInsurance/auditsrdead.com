import moment from '../ext/moment.js';

window.app = {};

window.app.escape = (str = "") => {
  let r = /[&<>"'\/]/g;
  return '' + str.replace(r, m => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "/": "&#x2F;"
    } [m];
  });
}

window.app.domify = (str) => {
  const dom = new DOMParser();
  return dom.parseFromString(str, 'text/html').querySelector('body').firstChild;
}

window.app.parse = (tmpl, ...vs) => {
  let result = '';
  for (let i = 0; i < vs.length; i++) {
    if (vs[i] instanceof SafeString)
      result += tmpl[i] + vs[i].toString();
    else
      result += tmpl[i] + window.app.escape(String(vs[i]));
  }
  return new SafeString(result + tmpl[vs.length]);
}

export class SafeString {
  constructor(s) {
    this.s = s;
  }
  toString() {
    return this.s;
  }
}

window.app.setCookie = (cname, cvalue, exdays) => {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

window.app.getCookie = cname => {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

window.app.currency = (value, abbreviate) => {
  value = _ethers.utils.formatUnits(value, 18);
  if (value === "0.0") return "$0.00"

  let split = value.split('.');
  if (split[1].length !== 18) {
    for (var i = 0; 18 - split[1].length; i++) {
      split[1] += '0';
    }
  }
  
  if (abbreviate) {
    value = split[0] + '.' + split[1];
    return '$' + window.app.abbreviateNumber(value.substring(0, value.length - 16));
  } else {
    value = parseInt(split[0]).toLocaleString() + '.' + split[1];
    return '$' + value.substring(0, value.length - 16);
  }
}

window.app.abbreviateNumber = value => {
  let newValue = parseInt(value);
  const suffixes = ["", "K", "M", "B", "T"];
  let suffixNum = 0;
  while (newValue >= 1000) {
    newValue /= 1000;
    suffixNum++;
  }

  newValue = newValue.toPrecision(3);

  newValue += suffixes[suffixNum];

  let split = newValue.split('.');
  if (split[1].length !== 2) {
    for (var i = 0; 2 - split[1].length; i++) {
      split[1] += '0';
    }
  }
  newValue = split[0] + '.' + split[1];
  return newValue;
}

window.app.validateForm = form => {
  let inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  let valid = true;

  inputs.forEach(item => {
    if (!item.value || item.value === "") {
      if (valid) item.focus();
      valid = false;
    }
  });

  return valid;
}

window.app.formatDate = date => {
  return new moment(date).format('DD-MM-YYYY HH:MM')
}
window.app.formatHash = hash => {
  hash = hash.substring(0, 6) + '...' + hash.substring(hash.length - 4, hash.length);
  return hash;
}

window.app.timeSince = date => {
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}