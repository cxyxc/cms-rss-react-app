import * as React from 'react'
import { PreviewInfo } from './interfaces'
import request, { getRss } from '../../request'
import ReactJson from 'react-json-view'

interface Props {
    data: PreviewInfo
}

function useRssPreview(data: PreviewInfo) {
    const [json, setJson] = React.useState()

    React.useEffect(() => {
        request({
            options: {
                url: data.url,
            }
        }).then(d => {
            setJson(d)
        }).catch(() => {
        })
    }, [])

    return {
        json
    }
}

export default function RssPreview(props: Props) {
    const { json } = useRssPreview(props.data)

    return (
        <div>
            <ReactJson src={json} collapsed={2} />
        </div>
    )
}
