var person = {
    name: 'Biplap',
    address: 'Kalanki',
    email: 'bb58@gmail.com',
    intrests: ['Biking', 'Travelling'],
    education: [],
};

person.education.push({
    name: 'BFSS',
    enrolledDate: 'Naikap'
});

person.education.push({
    name: 'Trinity',
    enrolledDate: 'Dillibazar'
});

person.education.push({
    name: 'KIST',
    enrolledDate: 'Kamalpokhari'
});
console.log(person);

person.education.forEach(function (edu) {
    console.log('Name:' + edu.name + ', Date: ' + edu.enrolledDate);
});