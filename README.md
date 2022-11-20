# moneytree
Money tree is a web app where users are each given their own virtual tree that they can take care of. Logging in daily rewards our very own cryptocurrency, leaves. leaves can be spent on feed which allows you to grow your tree. Leaves can be purchased using hbars, this is the standard currency of the hedera blockchain we built our application on
## Installation
The application can be started by running `npm install` and then `npm start` with moneytreesclient

## setup
To create your own account on the app, you must setup a development account in the hedera testnet which can be found here https://discord.com/channels/@me/897135841179238410/1043849892507942963
After creating your account, put your account id and private key into the global variables at the top of contract.js. This will setup your account for when you next run the application
## contract deployment
If you want to make any changes to the applications smart contract or create new contracts, do this inside the contracts folder of blockchain/contracts 
Then run `truffle compile` to compile your solidity files
After doing this run `node deploy.js` to deploy your contract, this will output the id of the newly created contract which needs to be put inside the global variable at the top of contract.js to make the application use the new contract
