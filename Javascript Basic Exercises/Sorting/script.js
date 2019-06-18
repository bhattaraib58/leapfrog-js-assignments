var arr = [{
    id: 1,
    name: 'John',
}, {
    id: 2,
    name: 'Mary',
}, {
    id: 3,
    name: 'Andrew',
}];
console.log(arr);

function sortBy(array, key) {
    var newArray = array.slice(0);
    var i = 0, j = 0;

    var tmp = [];
    for (i = 0; i < newArray.length - 1; i++) {

        for (j = 0; j < newArray.length - 1; j++) {

            if (newArray[j].name.toLowerCase() > newArray[j + 1].name.toLowerCase()) {
                tmp = newArray[j];
                newArray[j] = newArray[j + 1];
                newArray[j + 1] = tmp;
            }
        }
    }
    console.log(newArray);
}

var sorted = sortBy(arr, 'name');
