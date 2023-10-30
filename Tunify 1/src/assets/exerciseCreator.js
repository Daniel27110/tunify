const fs = require('fs');

function generateAlphatexFile(notes) {
    let fileContent = '\\instrument 25 ';
    

    fs.writeFileSync('output.txt', fileContent);
}
