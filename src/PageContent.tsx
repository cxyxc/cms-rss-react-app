import * as React from 'react'
import { useRecoilValue } from 'recoil';
import { usePlugin } from 'tinacms';
import { Box, Button, Container, Flex, Heading, LinkBox, List, ListItem, Text } from '@chakra-ui/react';
import SwitchPreview from './components/Preview/SwitchPreview';
import { globalListState } from './global';
import { ArrowForwardIcon } from '@chakra-ui/icons';

const SwaggerReaderCreatorPlugin = {
  __type: 'content-creator',
  name: 'Add New SwaggerReader',
  fields: [
    {
      label: 'Title',
      name: 'title',
      component: 'text',
      validate(title) {
        if (!title) return "Required."
      }
    },
    {
      label: 'Swagger URL',
      name: 'url',
      component: 'text',
      validate(title) {
        if (!title) return "Required."
      }
    }
  ],
  onSubmit(values, cms) {
    return cms.api.swagger.create(values)
  },
}

const RSSReaderCreatorPlugin = {
  __type: 'content-creator',
  name: 'Add New RSSReader',
  fields: [
    {
      label: 'RSS URL',
      name: 'url',
      component: 'text',
      validate(title) {
        if (!title) return "Required."
      }
    }
  ],
  onSubmit(values, cms) {
    return cms.api.rss.create(values)
  },
}

export default function PageContent() {
  const [currentData, setCurrentData] = React.useState()
  usePlugin([SwaggerReaderCreatorPlugin, RSSReaderCreatorPlugin])
  const globalList = useRecoilValue(globalListState);

  return (
    <Flex>
      <List spacing={3}>
        {globalList.map(item => (
          <ListItem key={item.id}>
            <LinkBox as="article" maxW="sm" p="5" borderWidth="1px" rounded="md">
              <Box as="time" dateTime={item.time}>{item.time}</Box>
              <Heading size="md" my="2">
                {item.title}
              </Heading>
              <Text>{item.description}</Text>
              <Button
                rightIcon={<ArrowForwardIcon />}
                colorScheme="teal"
                variant="outline"
                onClick={() => setCurrentData(item)}>
                Preview
              </Button>
            </LinkBox>
          </ListItem>
        ))}
      </List>
      <Container
        maxW="none"
        ml="12px"
        borderWidth="1px"
        rounded="md"
        pt="12px"
      >
        <SwitchPreview data={currentData} />
      </Container>
    </Flex>
  );
}
