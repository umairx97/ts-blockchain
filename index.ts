const SHA256 = require('crypto-js').SHA256

type WalletAddress = `0x${number}`

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

class Blockchain {
  chain: Array<Block>
  difficulty: number

  constructor() {
    this.chain = [this.createGenesisBlock()]
    this.difficulty = 2
  }

  createGenesisBlock(): Block {
    return new Block('01/01/2020', { username: 'umair' }, 0)
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1]
  }

  addBlock(newBlock: Block): void {
    newBlock.previousHash = this.getLatestBlock().hash
    newBlock.mineBlock(this.difficulty)
    this.chain.push(newBlock)
  }

  isChainValid(): boolean {
    return this.chain.every(this.checkBlockValidity)
  }

  checkBlockValidity(block: Block, blockIndex: number): boolean {
    // do not include the genesis block in validation
    if (blockIndex === 0) return true

    const currentBlock = block
    const previousBlock = this.chain[blockIndex - 1]

    // Recalculate hash for integrity of data manipulation
    if (currentBlock.hash !== currentBlock.calculateHash()) return false

    if (currentBlock.previousHash !== previousBlock.hash) return false

    return true
  }
}

