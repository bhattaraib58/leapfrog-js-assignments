var astrik;

function printAstriks(number) {
    for (var i = 0; i < number; i++) {
        astrik = '';
        for (var j = number; j > i; j--) {
            astrik = astrik + '*';
        }
        console.log(astrik);
        console.log('\n');
    }
}

printAstriks(10);