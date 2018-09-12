module.exports = function (value) {
    if (0 === value) {
        return '0';
    }

    if (!value) {
        return '';
    }

    return value.toString();
};