import { useEffect } from 'react'
// import { useAccount } from 'wagmi'

import Modal from './Modal'
import ProgrammeHeader from '../header/Header'
import { BaseLabel, Link } from './DataDisplay'
import { BrandedProgrammeButton } from './Buttons'
import { CreateWalletButton } from '../smartwallet/CreateWalletButton'
import Spacer from './Spacer'
import SectionWrapper from './SectionWrapper'
import Body from './Body'
import { useWeb3Modal } from '@web3modal/wagmi/react'

function Connect(props) {
  const { address, brandColor, copyColor, isOpen, close } = props

  // const { address } = useAccount()
  const { open: openWeb3Modal, close: closeWeb3Modal } = useWeb3Modal()
  console.log('address............... 0', address)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty(
        '--npayme__brand-color',
        brandColor || '#000'
      )
      document.documentElement.style.setProperty(
        '--npayme__copy-color',
        copyColor || '#fff'
      )
      document.documentElement.style.setProperty('--widget-card', '#fff')
      document.documentElement.style.setProperty('--widget-contrast', '#1A1A1A')
      document.documentElement.style.setProperty(
        '--widget-contrast-low',
        '#464646'
      )
      document.documentElement.style.setProperty(
        '--widget-contrast-high',
        '#000'
      )

      document.documentElement.style.setProperty('--bg', copyColor || '#f2f4f5')
    }

    return () => {
      closeWeb3Modal()
    }
  }, [])

  const handleSuccess = () => {
    // Cloase Web3Modal
    closeWeb3Modal()

    // Close this modal
    close()
  }

  useEffect(() => {
    if (address) {
      handleSuccess()
    }
  }, [address])

  return (
    <Modal isOpen={isOpen} close={close}>
      <ProgrammeHeader title='Join & Sign In' back={close} />
      <Body>
        <SectionWrapper>
          <BaseLabel text-transform='none'>
            I'd like to join and I need a Web3 Wallet
          </BaseLabel>
          <Spacer size={8} />
          <CreateWalletButton
            handleSuccess={handleSuccess}
            handleError={(e) => console.log(e)}
          />
        </SectionWrapper>
        <SectionWrapper>
          <BaseLabel>I already have a Web3 Wallet</BaseLabel>
          <Spacer size={8} />
          <BrandedProgrammeButton onClick={() => openWeb3Modal()}>
            Connect Web3 Wallet
          </BrandedProgrammeButton>
        </SectionWrapper>
        <SectionWrapper>
          <Link
            text-transform='none'
            href={`https://ethereum.org/en/web3/`}
            target={'_blank'}
          >
            What's a Web3 Wallet and why do I need one?
          </Link>
        </SectionWrapper>
      </Body>
    </Modal>
  )
}

export default Connect
