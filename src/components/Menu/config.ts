import {MenuEntry} from '@pancakeswap-libs/uikit'

const config: MenuEntry[] = [
    {
        label: 'Home',
        icon: 'HomeIcon',
        href: '/',
    },
    {
        label: 'MINT',
        icon: 'MintIcon',
        items: [
            {
                label: 'Farms',
                href: '/farms/mint',
            },
            {
                label: 'Pools',
                href: '/pools/mint',
            },
            {
                label: 'Exchange',
                href: 'https://exchange.pancakeswap.finance/#/swap?outputCurrency=0x2Deb28ec61E7B6B4Bba5f8398398330227Cd293f',
            },
            {
                label: 'Chart',
                href: 'https://dex.guru/token/0x2Deb28ec61E7B6B4Bba5f8398398330227Cd293f-bsc',
            },

        ],
    },

    {
        label: 'SUGAR',
        icon: 'SugarIcon',
        items: [
            {
                label: 'Farms',
                href: '/farms/sugar',
            },
            {
                label: 'Pools',
                href: '/pools/sugar',
            },
            {
                label: 'Exchange',
                href: 'https://exchange.pancakeswap.finance/#/swap?outputCurrency=0x41AA9F842AF935cC71252C0dE4BFF13F821546b8',
            },
            {
                label: 'Chart',
                href: 'https://dex.guru/token/0x41AA9F842AF935cC71252C0dE4BFF13F821546b8-bsc',
            },
        ],
    },

    {
        label: 'TEASPORT',
        icon: 'TeaSportV1Icon',
        items: [
            {
                label: 'Farms',
                href: '/farms/teasport',
            },
            {
                label: 'Pools',
                href: '/pools/teasport',
            },
            {
                label: 'Exchange',
                href: 'https://exchange.pancakeswap.finance/#/swap?outputCurrency=0xFc5e7Bed6abA672c6d435715bA931fB75EebFd2A',
            },
            {
                label: 'Chart',
                href: 'https://dex.guru/token/0xFc5e7Bed6abA672c6d435715bA931fB75EebFd2A-bsc',
            },
        ],
    },
    {
        label: 'Zap',
        icon: 'TradeIcon',
        href: '/zap',
    },
    // {
    //     label: 'Vaults',
    //     icon: 'VaultsIcon',
    //     href: '/zap',
    // },

    {
        label: 'Vote',
        icon: 'TicketIcon',
        href: 'https://snapshot.org/#/tea-swap.eth',
    },
    // {
    //   label: 'NFT',
    //   icon: 'NftIcon',
    //   href: '/nft',
    // },

    {
        label: 'Listing',
        icon: 'ListingsIcon',
        items: [
            {
                label: 'DappRadar',
                href: 'https://dappradar.com/binance-smart-chain/defi/teaswap',
            },
            {
                label: 'IcoHolder',
                href: 'https://icoholder.com/fr/teaswap-1001257',
            },
            {
                label: 'Coinhut',
                href: 'https://coinhunt.cc/coin/2006554088',
            },
            {
                label: 'Coinsniper',
                href: 'https://coinsniper.net/coin/1473',
            },
        ],
    },
    {
        label: 'More',
        icon: 'MoreIcon',
        items: [
            {
                label: 'Website',
                href: 'https://tea-swap.finance/',
            },
        ],
    },
    // {
    //   label: 'Partnerships/IFO',
    //   icon: 'GooseIcon',
    //   href: 'https://docs.google.com/forms/d/e/1FAIpQLSe7ycrw8Dq4C5Vjc9WNlRtTxEhFDB1Ny6jlAByZ2Y6qBo7SKg/viewform?usp=sf_link',
    // },
    // {
    //   label: 'Audit by Hacken',
    //   icon: 'AuditIcon',
    //   href: 'https://www.goosedefi.com/files/hackenAudit.pdf',
    // },
    // {
    //   label: 'Audit by CertiK',
    //   icon: 'AuditIcon',
    //   href: 'https://certik.org/projects/goose-finance',
    // },
    // {
    //   label: 'Roadmap',
    //   icon: 'RoadmapIcon',
    //   href: '/roadmap',
    // },

    {
        label: 'Docs',
        icon: 'DocsIcon',
        href: 'https://docs.tea-swap.finance',
    },
    {
        label: 'Audit by TechRate',
        icon: 'AuditIcon',
        href: 'https://github.com/Tea-Swap/contract/blob/master/audits/techRate/Sugar_MasterTea.pdf',
    },
]

export default config
