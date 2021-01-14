import React, { FC, useCallback, useState } from 'react'
import { createClient } from 'fetcheese'
import { downloadProgress } from 'fetcheese/esm/fetch/downloadProgress'

const App: FC = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [total, setTotal] = useState(0)
  const [loaded, setLoaded] = useState(0)

  const handleLoad = useCallback(async () => {
    const client = createClient({
      baseURL: 'https://jsonplaceholder.typicode.com/1',
    })
    await client.get('https://images.unsplash.com/photo-1550330562-b055aa030d73?amp;w=550', {
      responseType: 'json',
      after: response => {
        downloadProgress(response, ({ loaded, total, done }) => {
          console.log(`Received ${loaded} of ${total}`, done)
          setLoaded(loaded)
          setTotal(total)
          setIsLoaded(done)
        })
      }
    })
  }, [])

  return (
    <div>
      <div data-is="loaded">
        Is loaded: {isLoaded ? 'true' : 'false'}
      </div>
      <div data-name="loaded">Loaded: {loaded}</div>
      <div data-name="total">Total: {total}</div>
      <div>
        <button onClick={handleLoad}>Start download</button>
      </div>
    </div>
  );
}

export default App;
