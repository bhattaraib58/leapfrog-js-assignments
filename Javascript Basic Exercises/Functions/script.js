var numbers = [1, 2, 3, 4];

function transform(collection, tranFunc) {
    return collection.map(function (num) {
        return tranFunc(num);
    });
}

var output = transform(numbers, function (num) { return num * 7; });
console.log(output);