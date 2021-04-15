const SHA256 = require('crypto-js').SHA256

class Block {
  timestamp: string | number
  transactions: any
  previousHash: string | any
  hash: string
  nonce: number


  constructor(timestamp: string | number, transactions: any, previousHash: string | any = '') {

    this.timestamp = timestamp
    this.transactions = transactions
    this.previousHash = previousHash
    this.hash = this.calculateHash()
    this.nonce = 0
  }

  calculateHash(): string {
    const fingerPrint: string = this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce
    return SHA256(fingerPrint).toString()
  }

  mineBlock(difficulty: number): void | Block {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++
      this.hash = this.calculateHash()
    }
  }
}

export default Block