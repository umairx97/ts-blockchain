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

  /**
   * Returns the SHA256 of this block (by processing all the data stored
   * inside this block)
   *
   * @returns {string}
   */
  calculateHash(): string {
    const fingerPrint: string = this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce
    return SHA256(fingerPrint).toString()
  }

  /**
   * Starts the mining process on the block. It changes the 'nonce' until the hash
   * of the block starts with enough zeros (= difficulty)
   *
   * @param {number} difficulty
   */
  mineBlock(difficulty: number): void | Block {
    const zerosRequired = Array(difficulty + 1).join("0")
    // keep generating hashes until it has number of zeros required
    while (this.hash.substring(0, difficulty) !== zerosRequired) {
      this.nonce++
      this.hash = this.calculateHash()
    }

  }
}

export default Block