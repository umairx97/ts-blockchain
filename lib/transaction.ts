import { WalletAddress } from '../utils/types'
import { SHA256 } from 'crypto-js'
import { ec } from 'elliptic'
import { KeyPair } from './elliptic'
class Transaction {
  fromAddress: WalletAddress
  toAddress: WalletAddress
  amount: number
  signature: string

  constructor(fromAddress: WalletAddress, toAddress: WalletAddress, amount: number) {
    this.fromAddress = fromAddress
    this.toAddress = toAddress
    this.amount = amount
    this.signature = ''
  }

  calculateTxHash(): string {
    return SHA256(this.fromAddress + this.toAddress + this.amount).toString()
  }

  signTrx(signingKey: ec.KeyPair): void {
    if (signingKey.getPublic('hex') !== this.fromAddress) {
      throw new Error('You cannot sign transactions for other wallets')
    }

    const txHash = this.calculateTxHash()
    const signature = signingKey.sign(txHash, 'base64');
    this.signature = signature.toDER('hex')
  }


  isValidTx(): boolean {
    if (this.fromAddress === null) return true

    if (!this.signature || !this.signature.length) {
      throw new Error('No signature in this transaction')
    }

    const publicKey = KeyPair.keyFromPublic(this.fromAddress, 'hex')
    return publicKey.verify(this.calculateTxHash(), this.signature)
  }
}

export default Transaction