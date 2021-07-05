import React from 'react'
import styled from 'styled-components'
import { useVaultUser } from 'state/hooks'
import { Text, Tag } from '@pancakeswap-libs/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import { Token } from 'config/constants/types'
import TokenPairImage from 'components/TokenPairImage'

export interface VaultProps {
  label: string
  pid: number
  id: number
  token: Token
  quoteToken: Token
}

const Container = styled.div`
  padding-left: 16px;
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 32px;
  }
`

const TokenWrapper = styled.div`
  padding-right: 8px;
  width: 24px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
  }
`

const Vault: React.FunctionComponent<VaultProps> = ({ token, quoteToken, label, pid, id }) => {
  const { stakedBalance } = useVaultUser(pid, id)
  const rawStakedBalance = getBalanceNumber(stakedBalance)

  const handleRenderFarming = (): JSX.Element => {
    if (rawStakedBalance) {
      return (
        <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
          Farming
        </Text>
      )
    }

    return null
  }

  return (
    <Container>
      <TokenWrapper>
        <TokenPairImage variant="inverted" primaryToken={token} secondaryToken={quoteToken} width={40} height={40} />
      </TokenWrapper>
      
      <div>
        {handleRenderFarming()}
        <Text bold color="primary" fontSize="12px">EARNS {label}</Text>
        <Text bold>{label}</Text>
        <Tag outline variant="success" mr="8px">
          PCS
        </Tag>
      </div>
    </Container>
  )
}

export default Vault
