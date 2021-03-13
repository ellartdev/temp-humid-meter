const sortNumbers = (a, b) => a - b;
const sortABC = (a, b) => a.localeCompare(b);
const sortTimes = (a, b) => {
    if (parseInt(a.split(":")[0]) - parseInt(b.split(":")[0]) === 0) {
        return parseInt(a.split(":")[1]) - parseInt(b.split(":")[1]);
    } else {
        return parseInt(a.split(":")[0]) - parseInt(b.split(":")[0]);
    };
};
const sortArray = (arrays, index, fn) => {
    let source = arrays[index];
    let indices = [...source.keys()].sort((a, b) => fn(source[a], source[b]));
    return arrays.map(a => indices.map(i => a[i]));
};

exports.sortNumbers = sortNumbers;
exports.sortABC = sortABC;
exports.sortTimes = sortTimes;
exports.sortArray = sortArray;
