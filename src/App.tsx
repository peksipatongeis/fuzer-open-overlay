import * as React from 'react';
import { AblyProvider, ChannelProvider } from 'ably/react';
import * as Ably from 'ably';
import { EditMode } from './EditMode';
import { OverlayView } from './OverlayView';

import './App.css';

// Connect to Ably using the AblyProvider component and your API key
const client = new Ably.Realtime({
  key: import.meta.env.VITE_ABLY_API_KEY,
});

const getOverlayMode = (): 'edit' | 'overlay' => {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');

  return mode === 'overlay' ? 'overlay' : 'edit';
};

function App() {
  const [mode] = React.useState(getOverlayMode);

  const isEditMode = mode !== 'overlay';

  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName="fuzer-open-overlay">
        {isEditMode ? <EditMode /> : <OverlayView />}
      </ChannelProvider>
    </AblyProvider>
  );
}

export default App;
