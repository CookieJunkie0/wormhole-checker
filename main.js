const fs = require('fs');

const NETWORK = "Solana"; // EVM, Solana, Aptos, Sui, Injective

const networks = {
    "EVM": 2,
    "Solana": 1,
    "Aptos": 22,
    "Sui": 21,
    "Injective": 19,
}

async function checkWallet(wallet) {
    try {
        const result = await fetch(`https://prod-flat-files-min.wormhole.com/${wallet.toLowerCase()}_${networks[NETWORK]}.json`);

        if(!result.ok) {
            return {success: false, err: result}
        }

        const json = await result.json();
        return {success: true, amount: json.amount/1000000000};

    } catch(e) {return {success: false, err: e}}
}

async function main() {

    const wallets = fs.readFileSync('./inputs/wallets.txt').toString().split('\n');
    for(i=0;i<wallets.length;i++) {
        const wallet = wallets[i].trim();
        const result = await checkWallet(wallet);
        if(result.success) {
            console.log(`${wallet} - ${result.amount}`);
            if(result.amount > 0) {
                fs.appendFileSync('./outputs/eligible.txt', `${wallet}:${result.amount}\n`);
                continue;
            }
            fs.appendFileSync('./outputs/empty.txt', `${wallet}\n`);
        } else {
            console.log(`${wallet} - ${result.err}`);
        }
    }
}

main()
