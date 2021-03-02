import * as React from 'react'
import { PreviewInfo } from './interfaces'
import { useForm, usePlugin } from 'tinacms'
import SwaggerPreview from './SwaggerPreview'
import { Center, Heading } from '@chakra-ui/layout'

interface Props {
    data: PreviewInfo
}

export default function SwitchPreview(props: Props) {
    const defaultPreview = (
        <Center minHeight={100}>
            <Heading size="lg">
                Welcome to CMS+RSS Listener and Reader. <br />
                Add something what you want. 
            </Heading>
        </Center>
    )
    const data = props.data
    if(!data) return defaultPreview

    const formConfig = {
        id: data.id,
        label: '编辑',
        fields: [
            {
                name: 'title',
                label: 'Title',
                component: 'text',
            },
            {
                name: 'body',
                label: 'Body',
                component: 'textarea',
            },
        ],
        loadInitialValues: () => {
            return Promise.resolve(props.data)
        },
        onSubmit: async () => {
            // TODO: 持久化逻辑
        },
    }
    const [currentData, currentForm] = useForm<PreviewInfo>(formConfig)
    usePlugin(currentForm)

    if (currentData.type === 'swagger') return <SwaggerPreview data={currentData} />

    return defaultPreview
}
