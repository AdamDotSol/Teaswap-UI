import React, {useCallback, useMemo, useState} from 'react'
import {Heading, Card, CardHeader, CardBody, Input, Button, CardFooter} from '@pancakeswap-libs/uikit'
import Countdown, {CountdownRenderProps} from 'react-countdown';
import Page from 'components/layout/Page'
import styled from "styled-components";
import BigNumber from "bignumber.js";
import TokenInput from 'components/TokenInput'
import {
    getCakeAddress,
    getMintAddress,
    getTeaSportAddress,
    getJaggeryAddress,
    getMigrationAddress
} from 'utils/addressHelpers'
import {useWallet} from "@binance-chain/bsc-use-wallet";
import {provider} from "web3-core";
import rTea from "./img/rTea.png";
import useTokenBalance from '../../hooks/useTokenBalance'
import {getBalanceNumber, getFullDisplayBalance} from '../../utils/formatBalance'
import {useERC20, useMigrationContract} from "../../hooks/useContract";
import {
    useMigrationAllowance,
    useMigrationApprove, useMigrationToken
} from "../../hooks/useMigrationToken";


const Migration: React.FC = () => {

    const [token, setToken] = React.useState('Sugar');
    const [requestedApproval, setRequestedApproval] = useState(false)
    const [pendingTx, setPendingTx] = useState(false)
    const disabled = true;

    let address = '';
    const rTeaAddress = getMigrationAddress();

    if (token === 'Sugar') {
        address = getCakeAddress();
    } else if (token === 'Mint') {
        address = getMintAddress();
    } else if (token === 'Teasport') {
        address = getTeaSportAddress();
    } else if (token === 'Jaggery') {
        address = getJaggeryAddress();
    }

    const userBalance = getBalanceNumber(useTokenBalance(address));
    const userBalanceFormated = (getBalanceNumber(useTokenBalance(address)) * 1e18).toFixed(4);
    const userBalanceFormatedrTea = (getBalanceNumber(useTokenBalance(rTeaAddress))).toFixed(4);


    const fullBalance = useMemo(() => {
        return getFullDisplayBalance(new BigNumber(userBalanceFormated))
    }, [userBalanceFormated])

    // partie migration
    const {account, ethereum}: { account: string; ethereum: provider } = useWallet()
    const contractRaisingToken = useERC20(address)
    const contractRaisingMigration = useMigrationContract()
    const allowance = useMigrationAllowance(contractRaisingToken, getMigrationAddress())
    const onApprove = useMigrationApprove(contractRaisingToken, getMigrationAddress())
    const isApproved = account && allowance && allowance.isGreaterThan(0)


    let ratio = '0:0';
    if (token === 'Sugar') {
        ratio = '76:1'
    }
    if (token === 'Mint') {
        ratio = '1.025:1'
    }
    if (token === 'Teasport') {
        ratio = '37:1'
    }
    if (token === 'Jaggery') {
        ratio = '20:1'
    }

    const [tokenAmout, setTokenAmout] = React.useState(userBalanceFormated.toString());
    const [amountRTEA, setAmountRTEA] = React.useState(0);

    const onMigration = useMigrationToken(contractRaisingMigration, token, tokenAmout)


    const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const t = event.currentTarget.value

        await setToken(t);

        if (t === 'Sugar') {
            const res = await swapToken(tokenAmout, t);
            setAmountRTEA(res);
        } else if (t === 'Mint') {
            const res = await swapToken(tokenAmout, t);
            setAmountRTEA(res);
        } else if (t === 'Teasport') {
            const res = await swapToken(tokenAmout, t);
            setAmountRTEA(res);
        } else if (t === 'Jaggery') {
            const res = await swapToken(tokenAmout, t);
            setAmountRTEA(res);
        }
    };

    const swapToken = async (amount, type) => {
        if (!amount || !type) {
            return 0;
        }

        if (type === 'Sugar') {
            return amount / 76;
        }
        if (type === 'Mint') {
            return amount * 1.025;
        }
        if (type === 'Teasport') {
            return amount / 37;
        }
        if (type === 'Jaggery') {
            return amount / 20;
        }

        return 0;
    }

    const handleChangeToken = async (e: React.FormEvent<HTMLInputElement>) => {
        const t = e.currentTarget.value
        await setTokenAmout(t);
        const res = await swapToken(t, token);
        setAmountRTEA(res);
    };

    const handleSelectMax = useCallback(async () => {
        setTokenAmout(fullBalance)
        const res = await swapToken(fullBalance, token);
        setAmountRTEA(res);
    }, [fullBalance, token])

    const handleApprove = useCallback(async () => {
        try {
            setRequestedApproval(true)
            await onApprove()
            setRequestedApproval(false)
        } catch (e) {
            console.error(e)
        }
    }, [onApprove])

    const handleMigrate = useCallback(async () => {
        try {
            setPendingTx(true)
            await onMigration()
            setPendingTx(false)
        } catch (e) {
            console.error(e)
        }
    }, [onMigration])


    const renderer = ({days, hours, minutes, seconds, completed}: CountdownRenderProps) => {
        if (days) {
            return (
                <Heading as="h5">
                    {days} days and {hours} hours remainings
                </Heading>
            )
        } else if (days === 0 && hours !== 0) {
            return (
                <Heading as="h5">
                    {hours} hours and {minutes} minutes remainings
                </Heading>
            )
        } else {
            return (
                <Heading as="h5">
                    {minutes} minutes and {seconds} seconds remainings
                </Heading>
            )
        }
    };

    const TokenImageWrapper = styled.div`
      float: right;
      align-items: center;
      margin-bottom: 16px;
    `
    const CardImage = styled.img`
      margin-right: 8px;
    `

    const addWatchRTEAToken = useCallback(async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const provider2 = window.ethereum
        if (provider2) {
            try {
                // wasAdded is a boolean. Like any RPC method, an error may be thrown.
                const wasAdded = await provider2.request({
                    method: 'wallet_watchAsset',
                    params: {
                        type: 'ERC20',
                        options: {
                            address: getMigrationAddress(),
                            symbol: 'rTea',
                            decimals: '18',
                            image: rTea,
                        },
                    },
                })

                if (wasAdded) {
                    console.log('Token was added')
                }
            } catch (error) {
                // TODO: find a way to handle when the user rejects transaction or it fails
            }
        }
    }, [])

    return (
        <Page>
            <Card>
                <CardHeader>
                    <div style={{textAlign: "center"}}>
                        <Heading as="h1" scale="xl">Convert your TeaSwap Tokens</Heading>
                        <Countdown date={Date.now() + 100000000} renderer={renderer}/>

                    </div>

                    <DivSelect value={token} onChange={handleChange}>
                        <option value="Sugar">Sugar</option>
                        <option value="Mint">Mint</option>
                        <option value="Teasport">Teasport</option>
                        <option value="Jaggery">Jaggery</option>
                    </DivSelect>
                    <TokenImageWrapper>
                        <Button onClick={addWatchRTEAToken} scale="sm">
                            +{' '}
                            <img
                                style={{marginLeft: 8}}
                                width={30}
                                src={rTea}
                                alt="metamask logo"
                            />
                        </Button>
                    </TokenImageWrapper>
                </CardHeader>
                <CardBody>
                    <div>
                        <TokenInput
                            value={tokenAmout}
                            onSelectMax={handleSelectMax}
                            onChange={handleChangeToken}
                            max={fullBalance}
                            symbol={token}
                        />
                    </div>
                    <div style={{textAlign: "center", marginTop: "35px"}}>
                        <Heading as="h2" scale="md">Conversion ratio for {token}: {ratio}</Heading>
                    </div>
                    <DivRtea>
                        <Label htmlFor="rTea">rTea Balance : {userBalanceFormatedrTea}</Label>
                        <Input
                            id="rTea"
                            name="number"
                            type="number"
                            value={amountRTEA}
                            disabled={disabled}
                        />
                    </DivRtea>
                </CardBody>

                <CardFooter style={{textAlign: "center"}}>
                    {!isApproved ?
                        <Button variant="primary" disabled={requestedApproval} onClick={handleApprove}>
                            Approve {token}
                        </Button>
                        : <Button variant="primary" onClick={handleMigrate}
                        >
                            Convert
                        </Button>
                    }
                </CardFooter>

            </Card>
        </Page>
    )

}

const DivSelect = styled.select`
  min-width: 25%;
  border: 1px solid var(--select-border);
  border-radius: 0.25em;
  padding: 0.25em 0.5em;
  font-size: 1.25rem;
  cursor: pointer;
  line-height: 1.1;
  background-color: #546a2a;
  background-image: linear-gradient(to top, #546a2a, #546a2a 33%);
  color: #f9f9f9;
  margin-top: 25px;

`

const DivRtea = styled.div`
  margin-top: 25px;

  & input {
    height: 60px;
    background-color: #eeeaf4 !important;
    color: #546a2a !important;
  }

`

const Label = styled.label`
  color: ${({theme}) => theme.colors.text};
  display: block;
  margin-bottom: 8px;
  margin-top: 24px;
  text-align: right;
  font-weight: bold;
`

export default Migration
