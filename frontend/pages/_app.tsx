
import type { AppProps } from 'next/app'
import '@rainbow-me/rainbowkit/styles.css';
import {
    ConnectButton,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
  goerli,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const {chains, publicClient} = configureChains(
    [mainnet, goerli], [alchemyProvider({apiKey:'8dsMm2d31fbEbXDsi_JY7ZvWdN5_a6KO' }), publicProvider()]
);
const { connectors } = getDefaultWallets({
    appName: 'Contact',
    projectId: '1.0.1',
    chains
  });
  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
  })
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
      <Component {...pageProps} />
      
      </RainbowKitProvider>
    </WagmiConfig>
  );
};