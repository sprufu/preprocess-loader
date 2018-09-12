function parseEvnValue (str) {
  if (!str) {
    return '';
  }

  let STR = str.toUpperCase();

  // NO，FALSE，OFF视为false，且忽略大小写
  if ('NO' === STR || 'FALSE' === STR || 'OFF' === STR) {
    return false;
  }

  // YES，TRUE，ON视为true，且忽略大小写
  if ('YES' === STR || 'TRUE' === STR || 'ON' === STR) {
    return true;
  }

  // 数字
  // -0.12
  if (/^-?(\d*)?\.?\d+$/.test(str)) {
    return +str;
  }

  // 字符串
  return str;
}

module.exports = parseEvnValue;
