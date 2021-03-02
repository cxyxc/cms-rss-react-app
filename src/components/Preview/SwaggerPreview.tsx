import * as React from 'react'
import { PreviewInfo } from './interfaces'
import { Button, ButtonGroup, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import ReactJson from 'react-json-view'
import request from '../../request'
import { useMap } from 'react-use'
import ReactDiffViewer from 'react-diff-viewer';
import { UnControlled as ReactCodeMirror } from 'react-codemirror2'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/javascript/javascript'

/** 搜索插件 */
import 'codemirror/addon/search/search.js';
import 'codemirror/addon/dialog/dialog.js';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/search/jump-to-line.js';
import 'codemirror/addon/search/match-highlighter.js';
import 'codemirror/addon/search/matchesonscrollbar.css';
import 'codemirror/addon/search/matchesonscrollbar.js';
import 'codemirror/addon/search/searchcursor.js';

const setCache = (id, value) => localStorage.setItem(id, JSON.stringify(value))
const getCache = id => {
    const text = localStorage.getItem(id)
    if (!text) return null
    return JSON.parse(text)
}
interface Props {
    data: PreviewInfo
}

function useSwaggerData(data): {
    raw: object
    ts: string
    oldTs: string
    loading: boolean
    handleQuery: () => void
} {
    // TODO: 后续考虑将数据均 global 化，通过 selector 提升性能
    const [result, { set, setAll }] = useMap({
        raw: {},
        ts: '',
        oldTs: '',
        loading: false
    })
    const cache = getCache(data.id)

    const handleQuery = () => {
        set('loading', true)
        request({
            options: {
                url: data.url,
                formatter: 'json-swagger'
            }
        }).then(d => {
            const tmp = {
                ...d,
                // 历史数据记录 - 仅最近一条
                oldTs: result.ts,
                loading: false
            }
            setAll(tmp)
            setCache(data.id, tmp)
        }).catch(() => {
            set('loading', false)
        })
    }

    React.useEffect(() => {
        if (cache) {
            // 使用缓存
            setAll(cache)
            return
        }
        handleQuery()
    }, [])

    return {
        ...result,
        handleQuery
    }
}

export default function SwaggerPreview(props: Props) {
    const { raw, ts, oldTs, loading, handleQuery } = useSwaggerData(props.data)

    return (
        <Tabs isFitted variant="enclosed">
            <ButtonGroup variant="outline" spacing="6" mb={4}>
                <Button
                    isLoading={loading}
                    colorScheme="blue"
                    onClick={handleQuery}
                >
                    重查数据
                </Button>
            </ButtonGroup>
            <TabList>
                <Tab>TypeScript Interface</Tab>
                <Tab>Diff TypeScript</Tab>
                <Tab>Swagger Raw</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <ReactCodeMirror
                        value={ts}
                        options={{
                            mode: 'javascript',
                            theme: 'material',
                            lineNumbers: true,
                            readOnly: true
                        }}
                    />
                </TabPanel>
                <TabPanel>
                    {
                        (oldTs && ts) ? (
                            <ReactDiffViewer
                                oldValue={oldTs}
                                newValue={ts}
                                disableWordDiff
                                showDiffOnly
                                useDarkTheme
                            />
                        ) : '暂无历史记录'
                    }
                </TabPanel>
                <TabPanel>
                    <ReactJson src={raw} collapsed={2} />
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}
