import { ApolloProvider } from '@apollo/client';
import XiaoBaoBaoChat from './components/XiaoBaoBaoChat';
import apolloClient from './lib/apollo';
import './index.css';

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="App">
        <XiaoBaoBaoChat />
      </div>
    </ApolloProvider>
  );
}