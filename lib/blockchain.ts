import Block from './block'

class Blockchain {
  chain: Array<Block>
  difficulty: number

  constructor() {
    this.chain = [this.createGenesisBlock()]
    this.difficulty = 1
  }

  createGenesisBlock(): Block {
    return new Block('01/01/2020', { username: 'umair' }, 0)
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1]
  }

  addBlock(newBlock: Block): Block {
    newBlock.previousHash = this.getLatestBlock().hash
    newBlock.mineBlock(this.difficulty)
    this.chain.push(newBlock)
    return newBlock
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

export default Blockchain