import Blockchain from './lib/blockchain'
import Block from './lib/block'
import { WalletAddress } from './utils/types'

class Transaction {
  fromAddress: WalletAddress
  toAddress: WalletAddress
  amount: number

  constructor(fromAddress: WalletAddress, toAddress: WalletAddress, amount: number) {
    this.fromAddress = fromAddress
    this.toAddress = toAddress
    this.amount = amount
  }
}

// const BNB = new Blockchain()
// BNB.addBlock(new Block(1, Date.now(), { amount: 10 }))
// BNB.addBlock(new Block(2, Date.now(), { amount: 10 }))

// console.log(BNB.chain)
