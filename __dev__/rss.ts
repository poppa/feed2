import { Feed } from '../dist'
import { ExtensionValueJson, Extension } from '../dist/lib/types'

const feed = new Feed({
  title: 'Feed Test 1',
  updated: new Date(),
  published: new Date(Date.now() - 3600 * 1000),
  link: 'https://kommunal-rapport.no/',
  description: { text: 'This is a simple test feed' },
  generator: 'Test Feed 2',
  copyright: 'Test Site 2',
  language: 'en-gb',
  image: {
    url: 'http://localhost/img.jpg',
    width: 144,
    height: 400,
  },
  feedLinks: {
    atom: 'https://kommunal-rapport.no/rss/sortable-general-newsletter',
    hub: 'http://localhost/hub',
  },
})
  .addNamespace([
    { ns: 'xmlns', name: 'dc', uri: 'http://purl.org/dc/elements/1.1/' },
    { ns: 'xmlns', name: 'media', uri: 'http://search.yahoo.com/mrss/' },
    { ns: 'xml', name: 'base', uri: 'https://kommunal-rapport.no/' },
    { ns: 'xmlns', name: 'atom', uri: 'http://www.w3.org/2005/Atom2' },
  ])
  .addExtension([
    {
      type: ['rss2', 'atom1'],
      name: 'media:content',
      value: {
        attributes: {
          url:
            'https://kommunal-rapport.no/sites/default/files/styles/' +
            'mailchimp_full_width/public/lauareid.jpg?itok=pWSmZwEs',
          fileSize: 1089745,
          type: 'image/jpeg',
          medium: 'image',
          width: 170,
          height: 142,
        },
      },
    },
    {
      type: 'json1',
      name: '_media',
      value: {
        arbitrary: 'Yes',
        data: true,
      },
    } as Extension<ExtensionValueJson>,
  ])

feed
  .addItem({
    id: { id: 'item1', isPermaLink: true },
    link: 'http://localhost/item1',
    title: 'Test item 1',
    date: new Date(Date.now()),
    description: 'Some description 1',
    comments: 'http://localhost/item1#comments',
    author: { name: 'John Doe', email: 'john.doe@site.dom' },
    category: ['news', 'sports'],
  })
  .addItem({
    id: { id: 'item2' },
    link: 'http://localhost/item2',
    title: 'Test item 2',
    date: new Date(Date.now() - 3600),
    description: 'Some description 2',
    comments: 'http://localhost/item2#comments',
    author: { name: 'Jane Doe', email: 'jane.doe@site.dom' },
  })
  .addItem({
    id: 'item3',
    link: 'http://localhost/item3',
    comments: 'http://localhost/item3#comments',
    author: { email: 'john.doe@site.dom' },
    title: 'Test item 3',
    date: new Date(Date.now() - 3600 * 2),
    content: '<p>Some encoded content</p>',
    source: { name: 'Feed Test 1', url: 'http://localhost/feed' },
    extension: {
      type: ['rss2', 'atom1'],
      name: 'media:content',
      value: {
        attributes: {
          url:
            'https://kommunal-rapport.no/sites/default/files/styles/' +
            'mailchimp_full_width/public/lauareid.jpg?itok=pWSmZwEs',
          fileSize: 1089745,
          type: 'image/jpeg',
          medium: 'image',
          width: 170,
          height: 142,
        },
      },
    },
    media: [
      {
        url: 'http://localhost/myfile.mp4',
        size: 123456,
        contentType: 'video/mpeg4',
      },
      {
        url: 'http://localhost/myotherfile.mp4',
        size: 4533424,
        contentType: 'video/mpeg4',
      },
    ],
  })

const res = feed.rss2()

console.log('Res:', res)
