import Blockchain from './lib/blockchain'
import Block from './lib/block'

const BNB = new Blockchain()
BNB.addBlock(new Block(1, Date.now(), { amount: 10 }))
BNB.addBlock(new Block(2, Date.now(), { amount: 10 }))

console.log(BNB.chain)
