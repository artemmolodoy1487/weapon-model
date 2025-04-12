const prompt = require('prompt-sync')();

let login_token = '';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function enter_menu(){
    if(login_token != ''){

    }
    console.log('1. Login' +'\n' + '2. Registration');

    const choice = prompt('Make your choice ');

    if(choice == 1){
        login_menu();
    }
    else if(choice ==2){
        registration_menu();
    }
    else{
        console.log('Invalid choice');
        main_menu();
    }
    
}

function login_menu(){
    const mail = prompt('Enter your mail');
    const password = prompt('Enter your password');
}

function registration_menu(){
    const name = prompt('Enter your name');
    const mail = prompt('Enter your mail');
    const password = prompt('Enter your password');
}

function main_menu(){
    
}