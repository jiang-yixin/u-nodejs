const person = {
  name: 'Simon',
  greet() {
    console.log("Hi, I'm " + this.name);
  }
};

//console.log(person.greet());

const animals = ['cat', 'dog'];
for (let animal of animals) {
  console.log(animal);
}

