import { useCallback } from 'react'
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk'
import { CoinbaseWalletLogo } from './CoinbaseWalletLogo'
import { BrandedProgrammeButton } from '../components/Buttons'

// const buttonStyles = {
//   background: 'transparent',
//   border: '1px solid transparent',
//   boxSizing: 'border-box',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'space-between',
//   // width: 100%,
//   // fontFamily: 'Arial, sans-serif',
//   // fontWeight: 'bold',
//   // fontSize: 18,
//   backgroundColor: '#0052FF',
//   paddingLeft: 15,
//   paddingRight: 30,
//   borderRadius: 10
// }

const sdk = new CoinbaseWalletSDK({
  appName: 'My Dapp',
  appLogoUrl: 'https://example.com/logo.png',
  appChainIds: [84532]
})

const provider = sdk.makeWeb3Provider()

export function CreateWalletButton({ handleSuccess, handleError }) {
  // const { connectors, connect, data } = useConnect()

  // const createWallet = useCallback(() => {
  //   const coinbaseWalletConnector = connectors.find(
  //     (connector) => connector.id === 'coinbaseWalletSDK'
  //   )
  //   if (coinbaseWalletConnector) {
  //     connect({ connector: coinbaseWalletConnector })
  //   }
  // }, [connectors, connect])

  const createWallet = useCallback(async () => {
    try {
      // @ts-ignore
      const [address] = await provider.request({
        method: 'eth_requestAccounts'
      })
      handleSuccess(address)
    } catch (error) {
      handleError(error)
    }
  }, [handleSuccess, handleError])

  return (
    <BrandedProgrammeButton onClick={createWallet}>
      <CoinbaseWalletLogo />
      Create Coinbase Smart Wallet
    </BrandedProgrammeButton>
  )
}
