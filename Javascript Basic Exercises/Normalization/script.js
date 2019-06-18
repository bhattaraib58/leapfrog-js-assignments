// From this
var input = {
    '1': {
        id: 1,
        name: 'John',
        children: [
            { id: 2, name: 'Sally' },
            { id: 3, name: 'Mark', children: [{ id: 4, name: 'Harry' }] }
        ]
    },
    '5': {
        id: 5,
        name: 'Mike',
        children: [{ id: 6, name: 'Peter' }]
    }
};
function normalizeData(input) {
    var output = {};
    // iterating over object keys
    for (var key in input) {
        // checking if object has the keys
        if (input.hasOwnProperty(key)) {
            addToOutput(output, input[key]);
        }
    }
    return output;
}

function addToOutput(output, element) {
    var object = {};
    object.id = element.id;
    object.name = element.name;

    // checking if children is not empty
    if (element.children != undefined) {
        addChildrenData(output, object, element.children);
    }
    output[element.id] = object;
}

function addChildrenData(output, object, children) {
    object.children = [];
    for (var j = 0; j < children.length; j++) {
        object.children.push(children[j].id);
        addToOutput(output, children[j]);
    }
}

// To this
var output = {
    '1': { id: 1, name: 'John', children: [2, 3] },
    '2': { id: 2, name: 'Sally' },
    '3': { id: 3, name: 'Mark', children: [4] },
    '4': { id: 4, name: 'Harry' },
    '5': { id: 5, name: 'Mike', children: [6] },
    '6': { id: 6, name: 'Peter' }
};

var result=normalizeData(input);
console.log('Result');
console.log(result);
console.log('input');
console.log(input);
console.log('output');
console.log(output);