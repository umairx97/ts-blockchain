import { WalletAddress } from '../utils/types'

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

export default Transaction