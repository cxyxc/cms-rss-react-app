import * as React from 'react'
import { RecoilRoot, useSetRecoilState } from 'recoil';
import { TinaProvider, TinaCMS } from 'tinacms';
import { ChakraProvider } from "@chakra-ui/react"
import PageContent from './PageContent';
import { globalListState } from './global';
import { PreviewInfo } from './components/Preview/interfaces';
import { nanoid } from 'nanoid';

function Home() {
  const setGlobalList = useSetRecoilState(globalListState);

  const cms = new TinaCMS({
    sidebar: true,
    enabled: true
  });

  // 添加 API
  cms.registerApi('swagger', {
    create: (values) => {
      const result: PreviewInfo = {
        ...values,
        id: nanoid(),
        type: 'swagger',
        time: new Date().toUTCString()
      }
      // 内存修改 + 持久化
      setGlobalList(state => {
        const globalList = state.concat(result)
        // TODO: 持久化方案调整
        localStorage.setItem('globalList', JSON.stringify(globalList))
        return state.concat(result)
      })
      return Promise.resolve()
    }
  })

  return (
    <TinaProvider cms={cms}>
      <ChakraProvider>
        <PageContent />
      </ChakraProvider>
    </TinaProvider >
  )
}

function App() {
  return (
    <RecoilRoot>
      <Home />
    </RecoilRoot>
  )
}

export default App