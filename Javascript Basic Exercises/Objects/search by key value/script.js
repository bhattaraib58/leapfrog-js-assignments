var fruits = [
    { id: 1, name: 'Banana', color: 'Yellow' },
    { id: 2, name: 'Apple', color: 'Red' },
    { id: 3, name: 'Strawberry', color: 'Red' },
    { id: 4, name: 'Mango', color: 'Yellow' }
];

function searchByKey(array, key, value) {
    for (var i = 0; i < (array.length - 1); i++) {
        if (array[i][key].toLowerCase() == value) {
            return array[i];
        }
    }
    return null;
}

function searchBYName(array, name) {
    for (var i = 0; i < (array.length - 1); i++) {
        if (array[i].name.toLowerCase() == name) {
            return array[i];
        }
    }
    return null;
}

var fruit = searchBYName(fruits, 'apple');
console.log(fruit);

var fruit2 = searchByKey(fruits, 'color', 'yellow');
console.log(fruit2);